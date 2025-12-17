import OpenAI from 'openai';
import { z } from 'zod';

const client = new OpenAI({
  apiKey: 'sk-4680d128a6b04bbd925de745c0181c94',
  baseURL: 'https://api.deepseek.com/v1'
});

// Test basic connection
async function testConnection() {
  console.log('🔌 Probando conexión con DeepSeek...');
  
  try {
    const response = await client.chat.completions.create({
      model: 'deepseek-chat',
      messages: [{ role: 'user', content: 'Hola, ¿cómo estás?' }],
      max_tokens: 100
    });

    console.log('✅ Conexión exitosa');
    console.log('📝 Respuesta:', response.choices[0]?.message?.content?.substring(0, 100));
    return true;
  } catch (error) {
    console.error('❌ Error de conexión:', error.message);
    return false;
  }
}

// Test plan creation
async function testPlanCreation() {
  console.log('\n📋 Probando creación de plan...');
  
  try {
    const response = await client.chat.completions.create({
      model: 'deepseek-chat',
      messages: [{
        role: 'user',
        content: `Create a simple investigation plan for: "Impact of AI on software development"

Return as JSON:
{
  "title": "Investigation title",
  "subtasks": [
    {
      "id": "task1",
      "description": "Describe task",
      "type": "research",
      "tools": ["web_search"],
      "estimatedTime": 30,
      "successCriteria": ["Criterion"]
    }
  ],
  "dependencies": []
}`
      }],
      temperature: 0.3,
      max_tokens: 1000
    });

    const content = response.choices[0]?.message?.content;
    console.log('✅ Plan generado exitosamente');
    
    // Try to parse JSON
    const jsonMatch = content.match(/```json\n([\s\S]*?)\n```/) || content.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      const jsonString = jsonMatch[1] || jsonMatch[0];
      const plan = JSON.parse(jsonString);
      console.log('✅ JSON parseado correctamente');
      console.log('📊 Plan:', JSON.stringify(plan, null, 2).substring(0, 300));
    }
  } catch (error) {
    console.error('❌ Error en creación de plan:', error.message);
  }
}

// Run tests
async function main() {
  console.log('🚀 Iniciando tests del Agente Investigador\n');
  console.log('='.repeat(50));
  
  const connected = await testConnection();
  
  if (connected) {
    await testPlanCreation();
  }
  
  console.log('\n' + '='.repeat(50));
  console.log('✅ Tests completados');
}

main().catch(console.error);
