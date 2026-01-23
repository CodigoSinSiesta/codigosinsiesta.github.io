import Anthropic from '@anthropic-ai/sdk';
import { z } from 'zod';

// ===========================
// TYPE DEFINITIONS
// ===========================

export const InvestigationPlanSchema = z.object({
  title: z.string(),
  subtasks: z.array(z.object({
    id: z.string(),
    description: z.string(),
    type: z.enum(['research', 'analysis', 'synthesis', 'validation']),
    tools: z.array(z.string()),
    estimatedTime: z.number(),
    successCriteria: z.array(z.string())
  })),
  dependencies: z.array(z.object({
    from: z.string(),
    to: z.string(),
    type: z.enum(['requires', 'enhances', 'parallel'])
  }))
});

export type InvestigationPlan = z.infer<typeof InvestigationPlanSchema>;

export interface Subtask {
  id: string;
  description: string;
  type: 'research' | 'analysis' | 'synthesis' | 'validation';
  tools: string[];
  estimatedTime: number;
  successCriteria: string[];
}

export interface ExecutionResult {
  subtaskId: string;
  success: boolean;
  data: any[];
  duration: number;
  quality?: number;
  error?: string;
}

export interface SynthesisResult {
  summary: string;
  findings: string[];
  analysis: string;
  conclusions: string;
  recommendations: string;
  quality: number;
  confidence: number;
}

export interface InvestigationResult {
  plan: InvestigationPlan;
  execution: ExecutionResult[];
  synthesis: SynthesisResult;
  metadata: InvestigationMetadata;
}

export interface InvestigationMetadata {
  topic: string;
  duration: number;
  toolsUsed: string[];
  quality: number;
}

export interface Tool {
  name: string;
  execute: (subtask: Subtask) => Promise<any>;
}

// ===========================
// INVESTIGATION MEMORY
// ===========================

interface Investigation {
  id: string;
  topic: string;
  result: InvestigationResult;
  timestamp: number;
}

interface SuccessfulPattern {
  topic: string;
  planStructure: any;
  quality: number;
  duration: number;
  tools: string[];
}

interface FailurePattern {
  topic: string;
  error: string;
  context: any;
  timestamp: number;
}

export class InvestigationMemory {
  private investigations: Map<string, Investigation> = new Map();
  private learnings: SuccessfulPattern[] = [];
  private failurePatterns: FailurePattern[] = [];

  recordSuccessfulPattern(topic: string, plan: InvestigationPlan, result: InvestigationResult) {
    const pattern: SuccessfulPattern = {
      topic,
      planStructure: this.extractPlanStructure(plan),
      quality: result.metadata.quality,
      duration: result.metadata.duration,
      tools: result.metadata.toolsUsed
    };

    this.learnings.push(pattern);
  }

  recordFailure(topic: string, error: Error, context: any) {
    this.failurePatterns.push({
      topic,
      error: error.message,
      context,
      timestamp: Date.now()
    });
  }

  private extractPlanStructure(plan: InvestigationPlan): any {
    return {
      subtaskTypes: plan.subtasks.map(s => s.type),
      dependencyCount: plan.dependencies.length,
      totalTime: plan.subtasks.reduce((sum, s) => sum + s.estimatedTime, 0)
    };
  }

  saveInvestigation(id: string, topic: string, result: InvestigationResult) {
    this.investigations.set(id, {
      id,
      topic,
      result,
      timestamp: Date.now()
    });
  }
}

// ===========================
// PLANNING ENGINE
// ===========================

export class PlanningEngine {
  constructor(private client: Anthropic) {}

  async createPlan(topic: string): Promise<InvestigationPlan> {
    const prompt = `Create a comprehensive investigation plan for: "${topic}"

Break down the investigation into logical subtasks with dependencies.

For each subtask, specify:
- Type: research, analysis, synthesis, or validation
- Tools needed (use generic names like "search", "analyze", "validate")
- Estimated time in minutes
- Success criteria

Consider dependencies between subtasks.

Return as JSON matching this schema:
{
  "title": "Investigation title",
  "subtasks": [
    {
      "id": "unique_id",
      "description": "What to do",
      "type": "research|analysis|synthesis|validation",
      "tools": ["tool1", "tool2"],
      "estimatedTime": 30,
      "successCriteria": ["Criterion 1", "Criterion 2"]
    }
  ],
  "dependencies": [
    {
      "from": "subtask1",
      "to": "subtask2",
      "type": "requires|enhances|parallel"
    }
  ]
}`;

    const response = await this.client.messages.create({
      model: 'claude-3-5-sonnet-20241022',
      max_tokens: 2000,
      messages: [{
        role: 'user',
        content: prompt
      }]
    });

    const content = response.content[0];
    if (content.type !== 'text') {
      throw new Error('Unexpected response type from Claude');
    }

    const planData = JSON.parse(this.extractJSON(content.text));
    return InvestigationPlanSchema.parse(planData);
  }

  private extractJSON(text: string): string {
    const jsonMatch = text.match(/```json\n([\s\S]*?)\n```/);
    return jsonMatch ? jsonMatch[1] : text;
  }
}

// ===========================
// EXECUTION ENGINE
// ===========================

export class ExecutionEngine {
  private tools: Map<string, Tool> = new Map();

  registerTool(tool: Tool) {
    this.tools.set(tool.name, tool);
  }

  async executePlan(plan: InvestigationPlan): Promise<ExecutionResult[]> {
    const results = new Map<string, ExecutionResult>();
    const pending = new Set(plan.subtasks.map(s => s.id));
    const executing = new Set<string>();

    while (pending.size > 0) {
      const readyTasks = plan.subtasks.filter(subtask => {
        if (!pending.has(subtask.id) || executing.has(subtask.id)) return false;

        return plan.dependencies
          .filter(dep => dep.to === subtask.id && dep.type === 'requires')
          .every(dep => results.has(dep.from));
      });

      if (readyTasks.length === 0) {
        throw new Error('Circular dependency or impossible plan detected');
      }

      const executionPromises = readyTasks.map(async (task) => {
        executing.add(task.id);
        pending.delete(task.id);

        try {
          const result = await this.executeSubtask(task);
          results.set(task.id, result);
          return result;
        } finally {
          executing.delete(task.id);
        }
      });

      await Promise.all(executionPromises);
    }

    return Array.from(results.values());
  }

  private async executeSubtask(subtask: Subtask): Promise<ExecutionResult> {
    const startTime = Date.now();

    try {
      const toolResults = await Promise.all(
        subtask.tools.map(toolName => {
          const tool = this.tools.get(toolName);
          if (!tool) {
            return Promise.resolve({ tool: toolName, result: 'Tool simulation', simulated: true });
          }
          return tool.execute(subtask);
        })
      );

      const result = {
        subtaskId: subtask.id,
        success: true,
        data: toolResults,
        duration: Date.now() - startTime,
        quality: this.assessQuality(toolResults, subtask.successCriteria)
      };

      return result;

    } catch (error) {
      return {
        subtaskId: subtask.id,
        success: false,
        error: (error as Error).message,
        duration: Date.now() - startTime,
        data: []
      };
    }
  }

  private assessQuality(toolResults: any[], successCriteria: string[]): number {
    return 8;
  }
}

// ===========================
// SYNTHESIS ENGINE
// ===========================

export class SynthesisEngine {
  constructor(private client: Anthropic) {}

  async synthesizeResults(
    plan: InvestigationPlan,
    executionResults: ExecutionResult[]
  ): Promise<SynthesisResult> {

    const successfulResults = executionResults.filter(r => r.success);
    const failedResults = executionResults.filter(r => !r.success);

    const synthesisContext = this.buildSynthesisContext(plan, successfulResults);

    const prompt = `Synthesize a comprehensive investigation report based on the following:

INVESTIGATION TOPIC: ${plan.title}

EXECUTION SUMMARY:
- Total subtasks: ${plan.subtasks.length}
- Successful: ${successfulResults.length}
- Failed: ${failedResults.length}

DETAILED RESULTS:
${synthesisContext}

SYNTHESIS REQUIREMENTS:
1. Executive Summary (2-3 paragraphs)
2. Key Findings (bullet points)
3. Detailed Analysis (sections by subtask type)
4. Conclusions and Recommendations
5. Future Research Directions
6. Confidence Assessment

Structure the response with clear headings and actionable insights.
Assess the quality and completeness of the investigation.`;

    const response = await this.client.messages.create({
      model: 'claude-3-5-sonnet-20241022',
      max_tokens: 4000,
      temperature: 0.3,
      messages: [{
        role: 'user',
        content: prompt
      }]
    });

    const content = response.content[0];
    if (content.type !== 'text') {
      throw new Error('Unexpected response type from Claude');
    }

    const synthesis = content.text;

    return {
      summary: this.extractSection(synthesis, 'Executive Summary') || 'No summary available',
      findings: this.extractFindings(synthesis),
      analysis: this.extractSection(synthesis, 'Detailed Analysis') || 'No analysis available',
      conclusions: this.extractSection(synthesis, 'Conclusions') || 'No conclusions available',
      recommendations: this.extractSection(synthesis, 'Recommendations') || 'No recommendations available',
      quality: this.assessSynthesisQuality(synthesis, plan),
      confidence: this.calculateConfidence(successfulResults, failedResults)
    };
  }

  private buildSynthesisContext(plan: InvestigationPlan, results: ExecutionResult[]): string {
    return results.map(result => {
      const subtask = plan.subtasks.find(s => s.id === result.subtaskId);
      return `
SUBTASK: ${subtask?.description}
TYPE: ${subtask?.type}
DURATION: ${result.duration}ms
QUALITY: ${result.quality}/10

RESULTS:
${JSON.stringify(result.data, null, 2)}
`;
    }).join('\n---\n');
  }

  private extractSection(text: string, sectionName: string): string {
    const regex = new RegExp(`${sectionName}[:\\n]([\\s\\S]*?)(?=\\n\\n[A-Z]|$)`, 'i');
    const match = text.match(regex);
    return match ? match[1].trim() : '';
  }

  private extractFindings(text: string): string[] {
    const findingsSection = this.extractSection(text, 'Key Findings');
    if (!findingsSection) return [];

    return findingsSection
      .split('\n')
      .filter(line => line.trim().startsWith('-') || line.trim().startsWith('•'))
      .map(line => line.replace(/^[-•]\s*/, '').trim());
  }

  private assessSynthesisQuality(synthesis: string, plan: InvestigationPlan): number {
    const hasAllSections = ['Executive Summary', 'Key Findings', 'Conclusions'].every(
      section => synthesis.includes(section)
    );
    return hasAllSections ? 9 : 6;
  }

  private calculateConfidence(successful: ExecutionResult[], failed: ExecutionResult[]): number {
    const total = successful.length + failed.length;
    if (total === 0) return 0;
    return (successful.length / total) * 10;
  }
}

// ===========================
// INVESTIGATION AGENT (MAIN)
// ===========================

export class InvestigationAgent {
  private client: Anthropic;
  private memory: InvestigationMemory;
  private planningEngine: PlanningEngine;
  private executionEngine: ExecutionEngine;
  private synthesisEngine: SynthesisEngine;

  constructor(apiKey: string) {
    this.client = new Anthropic({ apiKey });
    this.memory = new InvestigationMemory();
    this.planningEngine = new PlanningEngine(this.client);
    this.executionEngine = new ExecutionEngine();
    this.synthesisEngine = new SynthesisEngine(this.client);
    this.initializeTools();
  }

  private initializeTools() {
    const searchTool: Tool = {
      name: 'search',
      execute: async (subtask) => {
        return { tool: 'search', result: `Search results for: ${subtask.description}` };
      }
    };

    const analyzeTool: Tool = {
      name: 'analyze',
      execute: async (subtask) => {
        return { tool: 'analyze', result: `Analysis for: ${subtask.description}` };
      }
    };

    const validateTool: Tool = {
      name: 'validate',
      execute: async (subtask) => {
        return { tool: 'validate', result: `Validation for: ${subtask.description}` };
      }
    };

    this.executionEngine.registerTool(searchTool);
    this.executionEngine.registerTool(analyzeTool);
    this.executionEngine.registerTool(validateTool);
  }

  async investigate(topic: string): Promise<InvestigationResult> {
    const startTime = Date.now();

    try {
      const plan = await this.planningEngine.createPlan(topic);

      const executionResults = await this.executionEngine.executePlan(plan);

      const synthesis = await this.synthesisEngine.synthesizeResults(plan, executionResults);

      const result: InvestigationResult = {
        plan,
        execution: executionResults,
        synthesis,
        metadata: {
          topic,
          duration: Date.now() - startTime,
          toolsUsed: this.getToolsUsed(executionResults),
          quality: this.assessQuality(synthesis)
        }
      };

      this.memory.recordSuccessfulPattern(topic, plan, result);
      this.memory.saveInvestigation(this.generateId(), topic, result);

      return result;

    } catch (error) {
      this.memory.recordFailure(topic, error as Error, { timestamp: Date.now() });
      throw error;
    }
  }

  private getToolsUsed(executionResults: ExecutionResult[]): string[] {
    const tools = new Set<string>();
    executionResults.forEach(result => {
      if (result.success && Array.isArray(result.data)) {
        result.data.forEach(item => {
          if (item.tool) {
            tools.add(item.tool);
          }
        });
      }
    });
    return Array.from(tools);
  }

  private assessQuality(synthesis: SynthesisResult): number {
    return synthesis.quality;
  }

  private generateId(): string {
    return `inv_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }
}
