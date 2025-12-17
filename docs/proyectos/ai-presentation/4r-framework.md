---
sidebar_position: 3
---

# El 4R Framework

El marco que transforma "vibe coding" en ingeniería de software responsable. **4R** significa **Risk**, **Readability**, **Reliability**, y **Resilience** - los cuatro pilares que aseguran que el código generado por IA sea seguro, mantenible, confiable y robusto.

## Visión General del Framework

Cada pilar aborda un aspecto crítico del desarrollo de software:

| Pilar | Enfoque | Pregunta Clave | Herramientas |
|-------|---------|----------------|-------------|
| **Risk** | Seguridad | ¿Es seguro este código? | SAST, Threat Modeling |
| **Readability** | Calidad | ¿Puede otro dev entenderlo? | Linting, Code Reviews |
| **Reliability** | Testing | ¿Funciona correctamente? | TDD, Coverage |
| **Resilience** | Robustez | ¿Sigue funcionando bajo presión? | Circuit Breakers, Monitoring |

## 🔴 Risk: Seguridad Primero

> *"La seguridad no es opcional. Es el precio de entrada."*

### Security Assessment Obligatorio

**Todo código generado por IA debe pasar security assessment antes de merge.**

#### Checklist de Seguridad

```typescript
// ❌ INCORRECTO: Código "vibe" sin validación
app.post('/api/user', (req, res) => {
  const user = db.user.create(req.body); // Mass assignment vulnerability!
  res.json(user);
});

// ✅ CORRECTO: Con validación de seguridad
const CreateUserSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
  name: z.string().min(2).max(100)
});

app.post('/api/user', async (req, res) => {
  try {
    const data = CreateUserSchema.parse(req.body);

    // Hash password
    const hashedPassword = await bcrypt.hash(data.password, 12);

    // Solo campos permitidos
    const user = await db.user.create({
      email: data.email,
      password: hashedPassword,
      name: data.name,
      role: 'user', // No permitir override
      isActive: true,
      createdAt: new Date()
    });

    res.json({ id: user.id, email: user.email, name: user.name });
  } catch (error) {
    res.status(400).json({ error: 'Datos inválidos' });
  }
});
```

### SAST (Static Application Security Testing)

**Herramientas recomendadas:**
- **ESLint Security Plugin**: `eslint-plugin-security`
- **Semgrep**: Para patrones de seguridad personalizados
- **SonarQube/SonarCloud**: Análisis completo

```json:package.json
{
  "devDependencies": {
    "eslint-plugin-security": "^2.1.0",
    "semgrep": "^1.50.0"
  }
}
```

**Reglas críticas:**
```javascript
// .eslintrc.js
module.exports = {
  plugins: ['security'],
  rules: {
    'security/detect-object-injection': 'error',
    'security/detect-eval-with-expression': 'error',
    'security/detect-no-csrf-before-method-override': 'error',
    'security/detect-possible-timing-attacks': 'error'
  }
};
```

### Threat Modeling para Código IA

**Preguntas que debes hacerte:**

1. **¿Qué datos sensibles maneja?**
2. **¿Cómo valida inputs?**
3. **¿Qué pasa si falla?**
4. **¿Puede ser usado para ataques?**

```typescript
// Ejemplo: Threat Model para API de pagos
interface PaymentAPIThreatModel {
  threats: {
    injection: 'SQL/NoSQL injection en payment data';
    dos: 'Large payment amounts causing system overload';
    fraud: 'Fake payment processing';
    dataLeak: 'Payment details in logs';
  };
  mitigations: {
    validation: 'Zod schemas + amount limits';
    rateLimit: '100 payments/min per user';
    audit: 'Payment logs without sensitive data';
    encryption: 'Encrypt payment data at rest';
  };
}
```

### OWASP Top 10 en Contexto IA

| OWASP Risk | Problema con IA | Solución 4R |
|------------|----------------|-------------|
| A01:2021 | Mass Assignment | Input Validation (Risk) |
| A02:2021 | Crypto Failures | Secure Defaults (Risk) |
| A03:2021 | Injection | Parameterized Queries (Risk) |
| A05:2021 | Security Misconfiguration | Secure Templates (Risk) |
| A06:2021 | Vulnerable Components | Dependency Scanning (Reliability) |
| A07:2021 | Identification/Authentication | Proper Auth (Risk) |
| A08:2021 | Software Integrity | Code Reviews (Readability) |
| A09:2021 | Logging/Monitoring | Observability (Resilience) |
| A10:2021 | SSRF | Input Sanitization (Risk) |

## 🔵 Readability: Código que se Mantiene

> *"Código que no se entiende, no se puede mantener. Código que no se mantiene, se reescribe."*

### Métricas de Complejidad

**Límite máximo recomendado:**
- **Complejidad Ciclomática**: < 10 por función
- **Líneas por función**: < 30
- **Profundidad de anidación**: < 4 niveles

```typescript
// ❌ INCORRECTO: Función compleja (CC = 15)
function processUserOrder(orderData: any) {
  if (orderData.user && orderData.user.id) {
    if (orderData.items && orderData.items.length > 0) {
      for (const item of orderData.items) {
        if (item.price && item.quantity) {
          if (item.price > 0 && item.quantity > 0) {
            // Procesar item...
            if (orderData.discount) {
              // Aplicar descuento...
            }
          }
        }
      }
    }
  }
}

// ✅ CORRECTO: Funciones simples y legibles
function validateOrder(order: Order): boolean {
  return !!(order.user?.id && order.items?.length);
}

function calculateItemTotal(item: OrderItem): number {
  if (item.price <= 0 || item.quantity <= 0) return 0;
  return item.price * item.quantity;
}

function applyDiscount(total: number, discount?: Discount): number {
  if (!discount?.percentage) return total;
  return total * (1 - discount.percentage / 100);
}

function processUserOrder(order: Order): OrderResult {
  if (!validateOrder(order)) {
    throw new ValidationError('Invalid order');
  }

  const itemTotals = order.items.map(calculateItemTotal);
  const subtotal = itemTotals.reduce((sum, total) => sum + total, 0);
  const finalTotal = applyDiscount(subtotal, order.discount);

  return { subtotal, discount: order.discount, total: finalTotal };
}
```

### Linting y Formato Automático

**Stack recomendado:**
```json:package.json
{
  "devDependencies": {
    "@typescript-eslint/eslint-plugin": "^6.0.0",
    "@typescript-eslint/parser": "^6.0.0",
    "eslint": "^8.0.0",
    "prettier": "^3.0.0"
  }
}
```

**Reglas críticas para IA:**
```javascript
// .eslintrc.js
module.exports = {
  rules: {
    // Legibilidad
    'max-lines-per-function': ['error', 30],
    'complexity': ['error', 10],
    'max-depth': ['error', 4],

    // Nombres descriptivos
    'id-length': 'off', // Permitir nombres largos descriptivos
    '@typescript-eslint/naming-convention': [
      'error',
      { selector: 'variableLike', format: ['camelCase'] },
      { selector: 'typeLike', format: ['PascalCase'] }
    ],

    // Evitar antipatrones comunes de IA
    'no-console': 'error',
    'no-debugger': 'error',
    'no-alert': 'error'
  }
};
```

### Convenciones de Nombres

**Sistema recomendado:**

| Tipo | Convención | Ejemplo |
|------|------------|---------|
| Variables | camelCase | `userEmail`, `orderTotal` |
| Funciones | camelCase | `validateUser()`, `calculateTotal()` |
| Clases | PascalCase | `UserService`, `OrderProcessor` |
| Interfaces | PascalCase + I | `IUserRepository`, `IOrderService` |
| Tipos | PascalCase | `UserRole`, `OrderStatus` |
| Archivos | kebab-case | `user-service.ts`, `order-processor.ts` |

### Documentación Obligatoria

**JSDoc para funciones públicas:**
```typescript
/**
 * Processes a user order with validation and discount calculation
 * @param order - The order to process
 * @returns Order processing result with totals
 * @throws ValidationError if order is invalid
 * @throws PaymentError if payment processing fails
 */
function processUserOrder(order: Order): Promise<OrderResult> {
  // Implementation...
}
```

## 🟢 Reliability: Testing que Importa

> *"Código sin tests es código roto esperando a ser ejecutado."*

### TDD (Test-Driven Development) con IA

**Flujo recomendado:**
1. **Escribe test primero** (describe comportamiento esperado)
2. **Genera código con IA** usando el test como guía
3. **Verifica que pase** el test
4. **Refactor si necesario**

```typescript
// 1. Test primero
describe('OrderProcessor', () => {
  it('should calculate total with discount', () => {
    const order = {
      items: [
        { price: 10, quantity: 2 },
        { price: 5, quantity: 1 }
      ],
      discount: { percentage: 10 }
    };

    const result = processOrder(order);

    expect(result.total).toBe(23); // (25 - 10% = 22.5, pero redondeo?)
  });
});

// 2. Implementación guiada por test
function processOrder(order: Order): OrderResult {
  const subtotal = order.items.reduce(
    (sum, item) => sum + (item.price * item.quantity),
    0
  );

  const discount = order.discount
    ? subtotal * (order.discount.percentage / 100)
    : 0;

  return {
    subtotal: Math.round(subtotal * 100) / 100,
    discount: Math.round(discount * 100) / 100,
    total: Math.round((subtotal - discount) * 100) / 100
  };
}
```

### Coverage Mínimo: 80%

**Configuración con herramientas:**
```json:package.json
{
  "devDependencies": {
    "vitest": "^1.0.0",
    "@vitest/coverage-v8": "^1.0.0"
  }
}
```

**Script de coverage:**
```json:package.json
{
  "scripts": {
    "test": "vitest",
    "test:coverage": "vitest --coverage",
    "test:ci": "vitest --run --coverage --reporter=json"
  }
}
```

### Mutation Testing

**Herramienta:** StrykerJS

```bash
npm install -D @stryker-mutator/core @stryker-mutator/vitest-runner
```

**Ejemplo de mutation:**
```typescript
// Código original
function add(a: number, b: number): number {
  return a + b;
}

// Mutations que prueba:
// return a - b;
// return a * b;
// return b + a; // Esta es equivalente, no un bug
// return 0;
// return a;
// return b;
```

### CI/CD Gates

**GitHub Actions ejemplo:**
```yaml:.github/workflows/ci.yml
name: CI
on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'pnpm'

      - name: Install dependencies
        run: pnpm install

      - name: Lint
        run: pnpm run lint

      - name: Security scan
        run: pnpm run security

      - name: Test with coverage
        run: pnpm run test:ci

      - name: Upload coverage
        uses: codecov/codecov-action@v3

      # Gates
      - name: Check coverage
        run: |
          COVERAGE=$(jq '.total.lines.pct' coverage/coverage-final.json)
          if (( $(echo "$COVERAGE < 80" | bc -l) )); then
            echo "Coverage too low: $COVERAGE%"
            exit 1
          fi
```

## 🟡 Resilience: Robustez Bajo Presión

> *"Los sistemas no fallan cuando las cosas van mal. Fallan cuando no están preparados para que las cosas vayan mal."*

### Circuit Breakers

**Patrón para fallos en cascada:**
```typescript
class CircuitBreaker {
  private failures = 0;
  private lastFailTime = 0;
  private state: 'CLOSED' | 'OPEN' | 'HALF_OPEN' = 'CLOSED';

  async execute<T>(operation: () => Promise<T>): Promise<T> {
    if (this.state === 'OPEN') {
      if (Date.now() - this.lastFailTime > 60000) { // 1 min timeout
        this.state = 'HALF_OPEN';
      } else {
        throw new Error('Circuit breaker is OPEN');
      }
    }

    try {
      const result = await operation();
      this.onSuccess();
      return result;
    } catch (error) {
      this.onFailure();
      throw error;
    }
  }

  private onSuccess() {
    this.failures = 0;
    this.state = 'CLOSED';
  }

  private onFailure() {
    this.failures++;
    this.lastFailTime = Date.now();

    if (this.failures >= 3) {
      this.state = 'OPEN';
    }
  }
}
```

### Timeout Strategies

```typescript
// Timeout wrapper
function withTimeout<T>(
  promise: Promise<T>,
  timeoutMs: number,
  fallback?: T
): Promise<T> {
  return Promise.race([
    promise,
    new Promise<never>((_, reject) =>
      setTimeout(() => reject(new Error('Operation timed out')), timeoutMs)
    )
  ]).catch(error => {
    if (fallback !== undefined && error.message.includes('timed out')) {
      return fallback;
    }
    throw error;
  });
}

// Uso en API calls
const paymentService = new CircuitBreaker();

async function processPayment(payment: Payment): Promise<PaymentResult> {
  return paymentService.execute(() =>
    withTimeout(
      api.processPayment(payment),
      5000, // 5 second timeout
      { status: 'PENDING', retry: true } // Fallback
    )
  );
}
```

### Logging Estructurado

```typescript
import winston from 'winston';

const logger = winston.createLogger({
  level: 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.errors({ stack: true }),
    winston.format.json()
  ),
  defaultMeta: { service: 'user-service' },
  transports: [
    new winston.transports.File({ filename: 'logs/error.log', level: 'error' }),
    new winston.transports.File({ filename: 'logs/combined.log' }),
    new winston.transports.Console({
      format: winston.format.combine(
        winston.format.colorize(),
        winston.format.simple()
      )
    })
  ]
});

// Uso correcto
export class UserService {
  async createUser(userData: CreateUserData): Promise<User> {
    logger.info('Creating user', {
      email: userData.email,
      correlationId: generateId()
    });

    try {
      const user = await this.db.user.create(userData);
      logger.info('User created successfully', { userId: user.id });
      return user;
    } catch (error) {
      logger.error('Failed to create user', {
        error: error.message,
        email: userData.email,
        stack: error.stack
      });
      throw error;
    }
  }
}
```

### Fallback Mechanisms

```typescript
class PaymentService {
  async processPayment(payment: Payment): Promise<PaymentResult> {
    // Intentar método primario
    try {
      return await this.primaryProcessor.process(payment);
    } catch (error) {
      logger.warn('Primary payment processor failed', { error: error.message });

      // Fallback al procesador secundario
      try {
        return await this.secondaryProcessor.process(payment);
      } catch (secondaryError) {
        logger.error('Both payment processors failed', {
          primary: error.message,
          secondary: secondaryError.message
        });

        // Último fallback: marcar como pendiente para reintento
        return {
          status: 'PENDING',
          id: payment.id,
          retryAt: Date.now() + 300000 // 5 minutos
        };
      }
    }
  }
}
```

## Integración de los 4 Pilares

### Decision Tree: ¿Cuándo aplicar cada pilar?

```
¿Qué tipo de código generas con IA?
│
├─ 🔴 Maneja datos sensibles o autenticación
│  └─ PRIORIDAD: Risk + Reliability + Resilience
│     (Ejemplo: APIs de usuario, pagos, auth)
│
├─ 🔵 Lógica compleja o crítica para negocio
│  └─ PRIORIDAD: Readability + Reliability
│     (Ejemplo: Algoritmos, cálculos, decisiones)
│
├─ 🟡 Integraciones externas o APIs
│  └─ PRIORIDAD: Resilience + Risk
│     (Ejemplo: Webhooks, llamadas a terceros)
│
├─ 🟢 Código utilitario o helpers
│  └─ PRIORIDAD: Readability + Reliability
│     (Ejemplo: Formatters, parsers, conversores)
│
└─ ⚫ Scaffolding o código boilerplate
   └─ PRIORIDAD: Readability
      (Ejemplo: tipos, configuraciones, setup)
```

### Matriz de Decisión por Contexto

| Contexto | Risk | Readability | Reliability | Resilience |
|----------|------|-------------|-------------|-----------|
| **Startup MVP** | ⭐⭐⭐ | ⭐⭐ | ⭐⭐⭐ | ⭐ |
| **B2B SaaS** | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐ | ⭐⭐⭐⭐ | ⭐⭐⭐⭐ |
| **Fintech** | ⭐⭐⭐⭐⭐ | ⭐⭐⭐ | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ |
| **Healthcare** | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐ |
| **Internal Tools** | ⭐⭐ | ⭐⭐ | ⭐⭐ | ⭐⭐ |
| **CLI Tools** | ⭐⭐ | ⭐⭐⭐ | ⭐⭐⭐ | ⭐⭐ |

### Orden de Aplicación

1. **Risk** primero: ¿Es seguro?
   - Identifica qué datos maneja
   - Valida inputs
   - Verifica permisos

2. **Readability**: ¿Se entiende?
   - Reduce complejidad
   - Documenta decisiones
   - Lint automático

3. **Reliability**: ¿Funciona?
   - Escribe tests primero (TDD)
   - Cubre caminos críticos
   - Valida con mutation testing

4. **Resilience**: ¿Aguanta?
   - Añade timeouts
   - Circuit breakers para dependencias
   - Logging y monitoring

### Checklist de Validación

```typescript
interface CodeValidationChecklist {
  risk: {
    inputValidation: boolean;
    secureDefaults: boolean;
    threatModeled: boolean;
    dependenciesScanned: boolean;
  };
  readability: {
    complexityUnder10: boolean;
    linesUnder30: boolean;
    documented: boolean;
    linted: boolean;
  };
  reliability: {
    tested: boolean;
    coverageOver80: boolean;
    ciPassing: boolean;
    mutationsPassing: boolean;
  };
  resilience: {
    timeoutsImplemented: boolean;
    circuitBreakers: boolean;
    logged: boolean;
    fallbacksExist: boolean;
  };
}
```

### Ejemplo Completo: API de Usuarios

```typescript
// ✅ 4R Framework aplicado
import { z } from 'zod';
import winston from 'winston';

const CreateUserSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
  name: z.string().min(2).max(100)
});

const logger = winston.createLogger({ /* config */ });

export class UserService {
  private circuitBreaker = new CircuitBreaker();

  /**
   * Creates a new user with validation and security
   * @param userData - User creation data
   * @returns Created user (without sensitive data)
   * @throws ValidationError if data is invalid
   * @throws DatabaseError if creation fails
   */
  async createUser(userData: CreateUserData): Promise<User> {
    // Risk: Input validation
    const data = CreateUserSchema.parse(userData);

    logger.info('Creating user', { email: data.email });

    try {
      // Resilience: Circuit breaker + timeout
      const user = await this.circuitBreaker.execute(() =>
        withTimeout(
          this.db.user.create({
            email: data.email,
            password: await bcrypt.hash(data.password, 12),
            name: data.name,
            role: 'user',
            isActive: true,
            createdAt: new Date()
          }),
          5000
        )
      );

      logger.info('User created', { userId: user.id });

      // Risk: No devolver datos sensibles
      return {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
        isActive: user.isActive,
        createdAt: user.createdAt
      };

    } catch (error) {
      logger.error('User creation failed', {
        error: error.message,
        email: data.email
      });
      throw error;
    }
  }
}

// Reliability: Tests completos
describe('UserService', () => {
  it('should create user with valid data', async () => {
    // Test implementation...
  });

  it('should reject invalid email', async () => {
    // Test implementation...
  });

  it('should hash password securely', async () => {
    // Test implementation...
  });

  it('should handle database timeout', async () => {
    // Test implementation...
  });
});
```

## Métricas de Éxito

**Objetivos por pilar:**

| Pilar | Métrica | Objetivo |
|-------|---------|----------|
| Risk | Security Issues | 0 en producción |
| Readability | Code Review Time | < 30 min por 100 líneas |
| Reliability | Test Coverage | > 80% |
| Resilience | MTTR | < 15 minutos |

## Implementación Gradual

**Fase 1: Básico** (Semana 1-2)
- ESLint + Prettier
- Zod para APIs críticas
- Tests básicos (70% coverage)

**Fase 2: Intermedio** (Semana 3-4)
- Circuit breakers en servicios externos
- Mutation testing
- Security scanning

**Fase 3: Avanzado** (Semana 5+)
- Full observability
- Automated security testing
- Performance monitoring

## Conclusión

El 4R Framework no es sobre **evitar IA**, sino sobre **usarla bien**. Es la diferencia entre código que "funciona" y código que **dura**.

**Pregunta final**: ¿Cuántos de estos pilares aplicas hoy en tu proyecto?

> *"La IA amplifica tu habilidad como desarrollador. El 4R Framework asegura que esa amplificación sea positiva."*

Siguiente: [Best Practices](./best-practices.md) - herramientas y patrones para implementar el framework. 🛠️
