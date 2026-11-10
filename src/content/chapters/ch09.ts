import type { Chapter } from '../../types/content'

export const chapter09: Chapter = {
  id: 'chapter-9',
  number: 9,
  title: '枚举与注解',
  subtitle: 'enum 是带字段、构造器与方法的特殊类；注解是元数据，编译器与框架据此做检查或处理。',
  lessons: [
    {
      id: 'c9l1',
      chapter: 9,
      title: 'enum：不只是常量列表',
      summary: '枚举常量是类型安全的对象；枚举可以有字段、构造器和方法，适合表达有限状态集合。',
      steps: [
        {
          id: 'c9l1-s1',
          type: 'goal',
          content: {
            text: '你能定义带字段与方法的枚举，用 switch 处理枚举，并知道 values / valueOf / ordinal 各自的作用。',
            checklist: ['知道枚举构造器是 private', '会用 values() 遍历', '知道不要用 ordinal 做持久化'],
          },
        },
        {
          id: 'c9l1-s2',
          type: 'concept',
          content: {
            title: '枚举常量是对象',
            paragraphs: [
              '`enum` 是特殊的类；每个枚举常量都是该枚举的一个实例，类型安全，不能随便传入别的值。',
              '枚举可以有字段、构造器和普通方法。构造器只能是 private（省略修饰符也一样），常量声明时传入参数。',
              '`values()` 返回全部常量的数组，`valueOf("NAME")` 按名字转换，找不到时抛 IllegalArgumentException。',
              '`name()` 返回常量名，`ordinal()` 返回声明位置（从 0 开始）。ordinal 会随声明顺序变化，不适合写入数据库或协议。',
              '枚举可以直接用于 switch；`case` 中写常量名，不需要枚举类型前缀。',
              '与 Go 的 iota 常量相比，Java 枚举是真正的类型；与 Python 的 Enum 类似，但 Java 枚举可以有方法和字段。',
            ],
            table: {
              headers: ['写法', '作用', '注意'],
              rows: [
                ['`Plan.PRO`', '引用一个枚举常量', '类型安全，不能传入任意字符串'],
                ['`values()`', '返回全部常量数组', '每次调用返回新数组'],
                ['`valueOf("PRO")`', '按名字查找', '名字不匹配抛 IllegalArgumentException'],
                ['`ordinal()`', '声明位置', '不要用于持久化'],
                ['`switch (plan)`', '分支处理', 'case 直接写常量名'],
              ],
            },
            note: '枚举适合状态、类型、级别这类有限集合；不适合会频繁新增、需要外部配置的动态值。',
          },
        },
        {
          id: 'c9l1-s3',
          type: 'example',
          content: {
            scenarios: [
              {
                name: '场景 1：带价格的套餐枚举',
                code: `enum Plan {
    BASIC(0), PRO(99), TEAM(299);

    private final int price;

    Plan(int price) {
        this.price = price;
    }

    int price() {
        return price;
    }
}

public class PlanDemo {
    public static void main(String[] args) {
        Plan plan = Plan.PRO;
        System.out.println(plan + " " + plan.price());
        System.out.println(plan.ordinal());
    }
}`,
                output: 'PRO 99\n1',
                lineNotes: {
                  1: '枚举声明；常量在类体最前面。',
                  2: '每个常量都传入价格参数，括号里是构造器实参。',
                  4: '枚举可以有字段；每个常量都有自己的字段值。',
                  6: '构造器只能是 private；这里省略了修饰符。',
                  10: '普通方法可以读取常量自己的字段。',
                  17: '引用 PRO 常量。',
                  18: 'toString 返回常量名，price() 返回 99。',
                  19: 'PRO 的声明位置是 1（BASIC 是 0）。',
                },
                takeaway: '**一般规则**：枚举常量是对象；字段与构造器让每个常量携带不同数据，方法负责行为。',
              },
              {
                name: '场景 2：switch 与 values 遍历',
                code: `enum OrderStatus {
    NEW, PAID, SHIPPED, DONE
}

public class StatusDemo {
    public static void main(String[] args) {
        OrderStatus status = OrderStatus.PAID;
        switch (status) {
            case PAID:
                System.out.println("已支付");
                break;
            default:
                System.out.println("其他状态");
        }
        for (OrderStatus value : OrderStatus.values()) {
            System.out.print(value + " ");
        }
        System.out.println();
    }
}`,
                output: '已支付\nNEW PAID SHIPPED DONE',
                lineNotes: {
                  1: '四个常量表示订单的有限状态。',
                  9: 'switch 直接使用枚举，case 写常量名。',
                  10: '匹配 PAID 分支。',
                  11: '传统 switch 语句需要 break，避免贯穿。',
                  15: 'values 返回全部常量。',
                  16: '按声明顺序遍历输出。',
                },
                takeaway: '**一般规则**：有限状态用枚举 + switch 表达；遍历全部常量用 values()。',
              },
            ],
          },
        },
        {
          id: 'c9l1-s4',
          type: 'quiz',
          content: {
            kind: 'choice',
            question: '关于枚举构造器，哪一句正确？',
            options: [
              '枚举构造器可以是 public',
              '枚举构造器只能是 private（或不写修饰符）',
              '枚举不能有构造器',
              '枚举构造器可以有返回值',
            ],
            answerIndex: 1,
            explanation: '枚举常量在类内部创建，构造器不能对外公开；写 public 会导致编译错误。',
          },
        },
        {
          id: 'c9l1-s5',
          type: 'coding',
          content: {
            exerciseId: 'c9l1-plan',
            task: '定义枚举 `Plan`：BASIC(0)、PRO(99)、TEAM(299)。读入套餐名，输出对应价格；未知名字输出 `unknown`。',
            io: `输入：一行套餐名（BASIC / PRO / TEAM）
输出：价格或 unknown
样例：输入 PRO → 输出 99
约束：用 valueOf 转换，并处理 IllegalArgumentException。`,
            skeleton: `import java.util.Scanner;

public class Main {
    enum Plan {
        BASIC(0), PRO(99), TEAM(299);

        private final int price;

        Plan(int price) {
            this.price = price;
        }

        int price() {
            return price;
        }
    }

    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);
        String name = scanner.nextLine().trim();
        // 用 Plan.valueOf 转换并输出价格
    }
}`,
            hints: [
              '概念回顾：`Plan.valueOf(name)` 按常量名查找，找不到抛 IllegalArgumentException。',
              '解题方向：把 valueOf 放进 try；成功输出 price()，失败输出 unknown。',
              '关键 API：`Enum.valueOf`、`IllegalArgumentException`。',
            ],
            tests: [
              {
                label: 'PRO 套餐',
                kind: 'normal',
                stdin: 'PRO\n',
                expectedStdout: '99\n',
              },
              {
                label: '免费套餐',
                kind: 'edge',
                stdin: 'BASIC\n',
                expectedStdout: '0\n',
              },
              {
                label: '不存在套餐',
                kind: 'tricky',
                stdin: 'TRIAL\n',
                expectedStdout: 'unknown\n',
              },
            ],
            answer: `import java.util.Scanner;

public class Main {
    enum Plan {
        BASIC(0), PRO(99), TEAM(299);

        private final int price;

        Plan(int price) {
            this.price = price;
        }

        int price() {
            return price;
        }
    }

    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);
        String name = scanner.nextLine().trim();
        try {
            System.out.println(Plan.valueOf(name).price());
        } catch (IllegalArgumentException e) {
            System.out.println("unknown");
        }
    }
}`,
            answerWhy:
              'valueOf 把字符串映射到枚举常量，名字必须与声明完全一致。捕获 IllegalArgumentException 后输出 unknown，避免把非法输入变成崩溃。',
          },
        },
        {
          id: 'c9l1-s6',
          type: 'summary',
          content: {
            points: [
              {
                kind: 'general',
                text: '**一般规则**：枚举常量是类型安全的对象，不是 int 常量；有限集合优先用 enum。',
              },
              {
                kind: 'general',
                text: '**一般规则**：枚举可以有字段、private 构造器和方法；每个常量携带自己的数据。',
              },
              {
                kind: 'general',
                text: '**一般规则**：values / valueOf 用于遍历与名字转换；ordinal 会随声明顺序变化，不适合持久化。',
              },
              {
                kind: 'scenario',
                text: '套餐枚举展示字段与方法；订单状态展示 switch 与 values。',
              },
            ],
          },
        },
        {
          id: 'c9l1-s7',
          type: 'pitfall',
          content: {
            items: [
              {
                wrong: 'enum Plan { BASIC; public Plan() {} }',
                why: '枚举构造器不能是 public，编译失败。',
                right: '省略修饰符或写 private。',
              },
              {
                wrong: 'int status = status.ordinal();  // 存入数据库',
                why: 'ordinal 取决于声明顺序，调整常量顺序后历史数据含义会变化。',
                right: '存储 name() 或显式的业务编码字段。',
              },
              {
                wrong: 'Plan.valueOf("basic")',
                why: 'valueOf 区分大小写，名字必须与常量声明完全一致。',
                right: '先规范大小写（如 toUpperCase），或使用自定义查找方法。',
              },
            ],
          },
        },
      ],
    },
    {
      id: 'c9l2',
      chapter: 9,
      title: '常用注解：@Override、@Deprecated 与 @FunctionalInterface',
      summary: '注解是元数据；@Override 让编译器检查重写，@Deprecated 标记过时 API，@FunctionalInterface 约束函数式接口。',
      steps: [
        {
          id: 'c9l2-s1',
          type: 'goal',
          content: {
            text: '你能解释注解与普通代码的区别，使用 @Override / @Deprecated / @SuppressWarnings / @FunctionalInterface，并知道它们各自由谁处理。',
            checklist: ['知道 @Override 是编译期检查', '会给过时 API 加 @Deprecated', '知道函数式接口只能有一个抽象方法'],
          },
        },
        {
          id: 'c9l2-s2',
          type: 'concept',
          content: {
            title: '注解本身不执行代码',
            paragraphs: [
              '注解是附加在类、方法、字段等元素上的元数据；单独写一个注解不会自动产生行为。',
              '`@Override` 由编译器检查：确实重写了父类或接口方法，否则编译失败。',
              '`@Deprecated` 标记不推荐使用的 API；调用处会出现编译警告，便于逐步迁移。',
              '`@SuppressWarnings("...")` 抑制指定类型的编译警告，例如未检查转换；不要无差别抑制所有警告。',
              '`@FunctionalInterface` 约束接口只有一个抽象方法；多于一个或零个抽象方法都会编译失败。',
              '注解的行为由编译器、框架或反射读取；本课程只讲声明与编译期作用，不展开运行时反射处理。',
            ],
            table: {
              headers: ['注解', '作用', '处理者'],
              rows: [
                ['`@Override`', '检查重写签名', '编译器'],
                ['`@Deprecated`', '标记过时 API', '编译器 / IDE'],
                ['`@SuppressWarnings`', '抑制指定警告', '编译器'],
                ['`@FunctionalInterface`', '约束单一抽象方法', '编译器'],
              ],
            },
            note: '注解不是注释：注释给人看，注解给编译器或工具看。',
          },
        },
        {
          id: 'c9l2-s3',
          type: 'example',
          content: {
            scenarios: [
              {
                name: '场景 1：重写检查与过时 API',
                code: `class Api {
    @Deprecated
    void oldCall() {
        System.out.println("old");
    }

    void current() {
        System.out.println("current");
    }
}

class SubApi extends Api {
    @Override
    void current() {
        System.out.println("sub current");
    }
}

public class AnnotationDemo {
    public static void main(String[] args) {
        new SubApi().current();
        new Api().oldCall();
    }
}`,
                output: 'sub current\nold',
                lineNotes: {
                  2: '标记 oldCall 为过时 API，调用处会出现警告。',
                  7: '父类提供 current 方法。',
                  13: '@Override 让编译器确认确实重写了父类方法。',
                  15: '重写后的行为。',
                  21: '调用子类重写版本，输出 sub current。',
                  22: '调用过时方法仍可运行，但会得到编译警告。',
                },
                takeaway: '**一般规则**：@Override 是安全网；@Deprecated 只是警告，不会阻止调用，应尽快迁移。',
              },
              {
                name: '场景 2：@FunctionalInterface 约束',
                code: `@FunctionalInterface
interface IntOp {
    int apply(int a, int b);
}

public class FunctionalAnnotationDemo {
    public static void main(String[] args) {
        IntOp add = (a, b) -> a + b;
        IntOp multiply = (a, b) -> a * b;
        System.out.println(add.apply(2, 3));
        System.out.println(multiply.apply(2, 3));
    }
}`,
                output: '5\n6',
                lineNotes: {
                  1: '声明这是函数式接口，编译器会检查抽象方法数量。',
                  3: '唯一的抽象方法；lambda 的目标类型就是它。',
                  8: 'lambda 实现 apply。',
                  9: '同一个接口可以有不同的 lambda 实现。',
                  10: '调用 add。',
                  11: '调用 multiply。',
                },
                takeaway: '**一般规则**：@FunctionalInterface 是编译期约束；抽象方法多于一个时，接口不能作为 lambda 的目标类型。',
              },
            ],
          },
        },
        {
          id: 'c9l2-s4',
          type: 'quiz',
          content: {
            kind: 'choice',
            question: '给方法加 `@Override` 的主要作用是什么？',
            options: [
              '让方法运行得更快',
              '让编译器检查方法确实重写了父类或接口方法',
              '把方法标记为过时',
              '自动生成方法体',
            ],
            answerIndex: 1,
            explanation: '@Override 不改变运行逻辑，只在编译期检查签名是否真的构成重写；拼错方法名时会直接报错。',
          },
        },
        {
          id: 'c9l2-s5',
          type: 'coding',
          content: {
            exerciseId: 'c9l2-format',
            task: '定义 `@FunctionalInterface interface Formatter { String format(String text); }`，用 lambda 实现“转大写并加前缀 `>> `”。读入一行文本，输出格式化结果。',
            io: `输入：一行文本
输出：">> " + 大写文本
样例：输入 java → 输出 >> JAVA
约束：必须使用带 @FunctionalInterface 的接口与 lambda。`,
            skeleton: `import java.util.Scanner;

public class Main {
    @FunctionalInterface
    interface Formatter {
        String format(String text);
    }

    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);
        String text = scanner.nextLine();
        Formatter formatter = value -> ">> " + value.toUpperCase();
        System.out.println(formatter.format(text));
    }
}`,
            hints: [
              '概念回顾：函数式接口只有一个抽象方法，lambda 可以直接实现它。',
              '解题方向：在 lambda 中先转大写，再拼前缀。',
              '关键 API：`String.toUpperCase`。',
            ],
            tests: [
              {
                label: '小写文本',
                kind: 'normal',
                stdin: 'java\n',
                expectedStdout: '>> JAVA\n',
              },
              {
                label: '空行',
                kind: 'edge',
                stdin: '\n',
                expectedStdout: '>> \n',
              },
              {
                label: '已经是大写',
                kind: 'tricky',
                stdin: 'OOP\n',
                expectedStdout: '>> OOP\n',
              },
            ],
            answer: `import java.util.Scanner;

public class Main {
    @FunctionalInterface
    interface Formatter {
        String format(String text);
    }

    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);
        String text = scanner.nextLine();
        Formatter formatter = value -> ">> " + value.toUpperCase();
        System.out.println(formatter.format(text));
    }
}`,
            answerWhy:
              'Formatter 只有一个抽象方法，lambda 可以自动匹配。方法体内完成转大写与前缀拼接；接口上的注解让编译器保证它始终是函数式接口。',
          },
        },
        {
          id: 'c9l2-s6',
          type: 'summary',
          content: {
            points: [
              {
                kind: 'general',
                text: '**一般规则**：注解是元数据，本身不执行逻辑；编译器或框架决定如何使用它。',
              },
              {
                kind: 'general',
                text: '**一般规则**：@Override 用于防拼写错误；@Deprecated 标记过时 API；@SuppressWarnings 精确抑制警告。',
              },
              {
                kind: 'general',
                text: '**一般规则**：@FunctionalInterface 要求恰好一个抽象方法，是 lambda 可赋值的前提。',
              },
              {
                kind: 'scenario',
                text: '重写示例展示 @Override 与 @Deprecated；IntOp 展示函数式接口约束。',
              },
            ],
          },
        },
        {
          id: 'c9l2-s7',
          type: 'pitfall',
          content: {
            items: [
              {
                wrong: '在类上加 `@SuppressWarnings("all")` 包住所有代码。',
                why: '所有警告都被隐藏，包括真正需要关注的问题。',
                right: '只抑制具体警告类型，并尽量缩小作用范围。',
              },
              {
                wrong: '拼错方法名却以为加了 @Override 就万事大吉。',
                why: '@Override 会让编译失败，这正是它的价值；不要删掉注解来“修复”。',
                right: '修正方法签名，让它真正重写父类方法。',
              },
              {
                wrong: '给函数式接口加两个抽象方法，仍希望用 lambda。',
                why: 'lambda 只能匹配一个抽象方法，@FunctionalInterface 会直接报错。',
                right: '拆成两个接口，或用匿名类实现多个方法。',
              },
            ],
          },
        },
      ],
    },
    {
      id: 'c9l3',
      chapter: 9,
      title: '自定义注解与元注解',
      summary: '用 @interface 声明注解；@Retention 决定保留阶段，@Target 限制使用位置。运行时处理需要反射，本课只讲声明。',
      steps: [
        {
          id: 'c9l3-s1',
          type: 'goal',
          content: {
            text: '你能声明带元素与默认值的注解，用 @Retention / @Target 控制保留策略与使用位置，并知道默认保留级别是 CLASS。',
            checklist: ['会写 @interface', '知道 @Retention 三种策略', '知道 @Target 限制注解位置'],
          },
        },
        {
          id: 'c9l3-s2',
          type: 'concept',
          content: {
            title: '注解的声明结构',
            paragraphs: [
              '自定义注解用 `@interface` 声明；元素写成无参方法，可以有默认值，例如 `String value() default "dev"`。',
              '注解元素类型只能是基本类型、String、Class、枚举、注解或它们的数组。',
              '`@Retention` 决定注解保留到哪个阶段：SOURCE（源码，编译后丢弃）、CLASS（字节码中，运行时不保证可见）、RUNTIME（运行时可反射读取）。',
              '不写 @Retention 时默认是 CLASS；框架运行时读取的注解必须显式写 RUNTIME。',
              '`@Target` 限制注解可用的位置，如 TYPE、METHOD、FIELD、PARAMETER。',
              '`@Documented` 让注解出现在生成的文档中；`@Inherited` 让类注解可被子类继承（只对类注解有效）。',
            ],
            table: {
              headers: ['保留策略', '保留到', '典型用途'],
              rows: [
                ['`SOURCE`', '源码', '@Override、@SuppressWarnings 等编译期检查'],
                ['`CLASS`', '字节码（默认）', '编译工具处理，运行时不保证可见'],
                ['`RUNTIME`', '运行时', '框架通过反射读取，如 Spring 注解'],
              ],
            },
            note: '声明注解不等于处理注解；没有反射或注解处理器读取它，它只是附加的元数据。',
          },
        },
        {
          id: 'c9l3-s3',
          type: 'example',
          content: {
            scenarios: [
              {
                name: '场景 1：带默认值的注解',
                code: `import java.lang.annotation.Retention;
import java.lang.annotation.RetentionPolicy;
import java.lang.annotation.Target;
import java.lang.annotation.ElementType;

@Retention(RetentionPolicy.RUNTIME)
@Target(ElementType.TYPE)
@interface ServiceInfo {
    String name();

    String version() default "1.0";
}

@ServiceInfo(name = "order")
class OrderService {
}

@ServiceInfo(name = "user", version = "2.1")
class UserService {
}

public class ServiceDemo {
    public static void main(String[] args) {
        System.out.println(OrderService.class.getSimpleName());
        System.out.println(UserService.class.getSimpleName());
    }
}`,
                output: 'OrderService\nUserService',
                lineNotes: {
                  6: '保留到运行时，框架才能通过反射读取。',
                  7: '只允许标注在类型（类、接口等）上。',
                  8: '@interface 声明注解类型。',
                  9: 'name 没有默认值，使用时必须提供。',
                  11: 'version 有默认值，可省略。',
                  14: '在类上使用注解，name 必填。',
                  18: '提供两个元素，version 覆盖默认值。',
                  24: '这里只打印类名；读取注解值需要反射。',
                },
                takeaway: '**一般规则**：运行时框架要用的注解必须 @Retention(RUNTIME)，并用 @Target 限定使用位置。',
              },
              {
                name: '场景 2：源码级标记注解',
                code: `import java.lang.annotation.ElementType;
import java.lang.annotation.Target;

@Target({ ElementType.METHOD, ElementType.FIELD })
@interface Internal {
}

class Config {
    @Internal
    private String endpoint = "local";

    @Internal
    void refresh() {
        System.out.println("refresh");
    }
}

public class InternalDemo {
    public static void main(String[] args) {
        new Config().refresh();
    }
}`,
                output: 'refresh',
                lineNotes: {
                  4: '@Target 用数组同时允许方法和字段。',
                  5: '@interface 声明标记注解。',
                  6: '没有元素，也没有 @Retention；默认 CLASS，运行时不保证可读。',
                  9: '注解字段。',
                  12: '注解方法。',
                  20: '注解不影响方法本身的行为，调用照常执行。',
                },
                takeaway: '**一般规则**：标记注解可以没有元素；没有 @Retention(RUNTIME) 时，运行时反射读不到它。',
              },
            ],
          },
        },
        {
          id: 'c9l3-s4',
          type: 'quiz',
          content: {
            kind: 'choice',
            question: '希望框架在运行时通过反射读取一个自定义注解，@Retention 应设为？',
            options: ['`SOURCE`', '`CLASS`', '`RUNTIME`', '不需要设置'],
            answerIndex: 2,
            explanation: '只有 RUNTIME 保留策略能让注解在运行时通过反射读取；默认的 CLASS 不保证运行时可见。',
          },
        },
        {
          id: 'c9l3-s5',
          type: 'coding',
          content: {
            exerciseId: 'c9l3-label',
            task: '声明 `@interface Label { String value(); }` 并标注在 `Main` 上。读入一行文本，输出 `label:<文本>`（只演示注解声明，不要求反射读取）。',
            io: `输入：一行文本
输出：label:文本
样例：输入 order → 输出 label:order
约束：注解必须带一个 String 元素 value。`,
            skeleton: `import java.util.Scanner;

@interface Label {
    String value();
}

@Label("main")
public class Main {
    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);
        String text = scanner.nextLine();
        System.out.println("label:" + text);
    }
}`,
            hints: [
              '概念回顾：@interface 声明注解，元素写成无参方法。',
              '解题方向：在 main 类上方使用 @Label("main")，输出按任务要求拼接。',
              '关键 API：`@interface`、注解元素 `value()`。',
            ],
            tests: [
              {
                label: '普通文本',
                kind: 'normal',
                stdin: 'order\n',
                expectedStdout: 'label:order\n',
              },
              {
                label: '空行',
                kind: 'edge',
                stdin: '\n',
                expectedStdout: 'label:\n',
              },
              {
                label: '中文文本',
                kind: 'tricky',
                stdin: '订单\n',
                expectedStdout: 'label:订单\n',
              },
            ],
            answer: `import java.util.Scanner;

@interface Label {
    String value();
}

@Label("main")
public class Main {
    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);
        String text = scanner.nextLine();
        System.out.println("label:" + text);
    }
}`,
            answerWhy:
              '注解声明为 @interface，value() 是注解元素。标注在 Main 上只表达元数据；本练习不读取它，重点是把声明语法写对。',
          },
        },
        {
          id: 'c9l3-s6',
          type: 'summary',
          content: {
            points: [
              {
                kind: 'general',
                text: '**一般规则**：自定义注解用 @interface 声明；元素是无参方法，可以有默认值。',
              },
              {
                kind: 'general',
                text: '**一般规则**：@Retention 决定注解保留阶段；运行时反射读取必须用 RUNTIME。',
              },
              {
                kind: 'general',
                text: '**一般规则**：@Target 限制注解位置；@Documented / @Inherited 控制文档与继承行为。',
              },
              {
                kind: 'scenario',
                text: 'ServiceInfo 展示运行时注解与默认值；Internal 展示源码级标记注解与多位置 Target。',
              },
            ],
          },
        },
        {
          id: 'c9l3-s7',
          type: 'pitfall',
          content: {
            items: [
              {
                wrong: '写了一个自定义注解，却在运行时反射读取不到。',
                why: '没有声明 @Retention(RUNTIME)，默认 CLASS 在运行时不可用。',
                right: '加 `@Retention(RetentionPolicy.RUNTIME)`。',
              },
              {
                wrong: '把 @Target 声明为 METHOD，却标注在类上。',
                why: '@Target 限制了使用位置，位置不符会编译失败。',
                right: '把 TYPE 加入 @Target 数组。',
              },
              {
                wrong: '以为声明注解就会自动执行某个逻辑。',
                why: '注解只是元数据；需要反射或注解处理器读取并执行。',
                right: '明确谁在什么时候读取注解。',
              },
            ],
          },
        },
      ],
    },
  ],
}
