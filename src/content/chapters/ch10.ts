import type { Chapter } from '../../types/content'

export const chapter10: Chapter = {
  id: 'chapter-10',
  number: 10,
  title: 'Lambda 与函数式接口',
  subtitle: '把行为当作参数传递：一个抽象方法的接口 + lambda / 方法引用，就是 Java 的函数式写法。',
  lessons: [
    {
      id: 'c10l1',
      chapter: 10,
      title: '函数式接口与 lambda 基础',
      summary: '函数式接口只有一个抽象方法；lambda 实现它，目标类型由赋值或参数推断。',
      steps: [
        {
          id: 'c10l1-s1',
          type: 'goal',
          content: {
            text: '你能定义函数式接口，写出 lambda，理解目标类型与 effectively final 捕获，并知道 lambda 与匿名类的差异。',
            checklist: ['知道函数式接口的定义', '会写参数与表达式形式的 lambda', '知道捕获变量必须 effectively final'],
          },
        },
        {
          id: 'c10l1-s2',
          type: 'concept',
          content: {
            title: '一个抽象方法，一段行为',
            paragraphs: [
              '**函数式接口**是恰好有一个抽象方法的接口；`@FunctionalInterface` 让编译器检查这个约束。',
              'lambda 是函数式接口的实例：`(参数) -> 表达式` 或 `(参数) -> { 语句; return ...; }`。',
              'lambda 的**目标类型**由上下文决定：赋给哪个接口、传给哪个参数，就实现哪个抽象方法。同一个 lambda 写法在不同目标类型下含义不同。',
              'lambda 可以捕获外部的局部变量，但变量必须是 **effectively final**（赋值后不再改变）；捕获的是值的副本。',
              'lambda 不是匿名类的简写：`this` 指向外层对象，而不是 lambda 自身；lambda 也不能声明自己的字段。',
              'Go 的函数是一等值，Python 有 lambda 但没有静态类型检查；Java 的 lambda 必须依附于函数式接口。',
            ],
            table: {
              headers: ['写法', '含义', '示例'],
              rows: [
                ['`(a, b) -> a + b`', '表达式 lambda，自动返回', '`IntOp add = (a, b) -> a + b;`'],
                ['`x -> { return x * 2; }`', '语句块 lambda', '需要显式 return'],
                ['`() -> 42`', '无参数', '`Supplier<Integer>`'],
                ['`System.out::println`', '方法引用', '第 3 节的四种形式'],
              ],
            },
            note: 'lambda 参数类型可以省略，由目标接口推断；写类型时必须与抽象方法签名一致。',
          },
        },
        {
          id: 'c10l1-s3',
          type: 'example',
          content: {
            scenarios: [
              {
                name: '场景 1：自定义计算接口',
                code: `@FunctionalInterface
interface Calculator {
    int apply(int a, int b);
}

public class LambdaDemo {
    public static void main(String[] args) {
        Calculator add = (a, b) -> a + b;
        Calculator max = (a, b) -> a > b ? a : b;
        System.out.println(add.apply(2, 3));
        System.out.println(max.apply(2, 3));
    }
}`,
                output: '5\n3',
                lineNotes: {
                  1: '声明只有一个抽象方法的接口。',
                  3: 'apply 是 lambda 要实现的唯一方法。',
                  8: '表达式 lambda：两个参数，返回 a + b。',
                  9: '同一个接口的另一种行为。',
                  10: '调用 add，得到 5。',
                  11: '调用 max，得到 3。',
                },
                takeaway: '**一般规则**：函数式接口定义一个行为槽位；lambda 提供具体行为，调用方只依赖接口。',
              },
              {
                name: '场景 2：用 lambda 提供排序规则',
                code: `import java.util.ArrayList;
import java.util.List;

public class SortDemo {
    public static void main(String[] args) {
        List<String> names = new ArrayList<>(List.of("Bob", "Ada", "Cy"));
        names.sort((a, b) -> a.length() - b.length());
        System.out.println(names);
    }
}`,
                output: '[Cy, Bob, Ada]',
                lineNotes: {
                  6: '创建可变列表，初始顺序 Bob、Ada、Cy。',
                  7: 'Comparator 是函数式接口；lambda 返回负数表示 a 应排在 b 前。',
                  8: '按长度排序：Cy 最短；Bob 与 Ada 长度相同，保持原相对顺序。',
                },
                takeaway: '**一般规则**：把比较规则写成 lambda，排序方法本身不需要知道业务字段。',
              },
            ],
          },
        },
        {
          id: 'c10l1-s4',
          type: 'quiz',
          content: {
            kind: 'choice',
            question: '下面哪个接口可以直接用 `(a, b) -> a + b` 实现？',
            options: [
              '`interface Op { int apply(int a, int b); }`',
              '`interface Op { int apply(int a, int b); int other(); }`',
              '`interface Op { void apply(); }`',
              '`class Op { int apply(int a, int b) { return 0; } }`',
            ],
            answerIndex: 0,
            explanation: 'lambda 需要恰好一个抽象方法的接口。B 有两个抽象方法；C 参数不匹配；D 是类，不是接口。',
          },
        },
        {
          id: 'c10l1-s5',
          type: 'coding',
          content: {
            exerciseId: 'c10l1-multiply',
            task: '定义 `@FunctionalInterface interface IntOp { int apply(int a, int b); }`，用 lambda 实现乘法。读入两个整数，输出乘积。',
            io: `输入：两个整数
输出：乘积
样例：输入 2 3 → 输出 6
约束：必须使用函数式接口与 lambda。`,
            skeleton: `import java.util.Scanner;

public class Main {
    @FunctionalInterface
    interface IntOp {
        int apply(int a, int b);
    }

    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);
        int a = scanner.nextInt();
        int b = scanner.nextInt();
        IntOp multiply = (x, y) -> x * y;
        System.out.println(multiply.apply(a, b));
    }
}`,
            hints: [
              '概念回顾：函数式接口只有一个抽象方法，lambda 自动匹配它。',
              '解题方向：lambda 的两个参数相乘并返回。',
              '关键 API：不需要额外 API。',
            ],
            tests: [
              {
                label: '正整数',
                kind: 'normal',
                stdin: '2 3\n',
                expectedStdout: '6\n',
              },
              {
                label: '含 0',
                kind: 'edge',
                stdin: '0 5\n',
                expectedStdout: '0\n',
              },
              {
                label: '一正一负',
                kind: 'tricky',
                stdin: '-2 4\n',
                expectedStdout: '-8\n',
              },
            ],
            answer: `import java.util.Scanner;

public class Main {
    @FunctionalInterface
    interface IntOp {
        int apply(int a, int b);
    }

    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);
        int a = scanner.nextInt();
        int b = scanner.nextInt();
        IntOp multiply = (x, y) -> x * y;
        System.out.println(multiply.apply(a, b));
    }
}`,
            answerWhy:
              'IntOp 只有一个抽象方法，lambda `(x, y) -> x * y` 就是它的实例。参数名不需要与接口一致，位置与类型匹配即可。',
          },
        },
        {
          id: 'c10l1-s6',
          type: 'summary',
          content: {
            points: [
              {
                kind: 'general',
                text: '**一般规则**：函数式接口恰好一个抽象方法；lambda 的目标类型由上下文决定。',
              },
              {
                kind: 'general',
                text: '**一般规则**：lambda 捕获的局部变量必须 effectively final；它捕获的是值。',
              },
              {
                kind: 'general',
                text: '**一般规则**：lambda 让“行为”可以像数据一样传递，但必须依附于函数式接口。',
              },
              {
                kind: 'scenario',
                text: 'Calculator 展示自定义行为；sort 展示把比较规则作为参数传入。',
              },
            ],
          },
        },
        {
          id: 'c10l1-s7',
          type: 'pitfall',
          content: {
            items: [
              {
                wrong: 'int count = 0;\nRunnable r = () -> count++;',
                why: 'lambda 捕获的局部变量必须 effectively final，count 被修改后编译失败。',
                right: '用数组 / AtomicInteger 等可变容器，或把状态放到字段里。',
              },
              {
                wrong: 'Runnable r = () -> "done";',
                why: 'Runnable.run 返回 void，lambda 不能返回值。',
                right: '匹配抽象方法的返回类型；需要返回值用 Supplier。',
              },
              {
                wrong: '给函数式接口加第二个抽象方法，仍希望用 lambda。',
                why: 'lambda 只能实现一个抽象方法，编译失败。',
                right: '拆成两个接口，或用匿名类。',
              },
            ],
          },
        },
      ],
    },
    {
      id: 'c10l2',
      chapter: 10,
      title: '标准函数式接口：Function、Predicate、Consumer、Supplier',
      summary: 'Function 转换、Predicate 判断、Consumer 消费、Supplier 提供；组合操作用 andThen / negate / and。',
      steps: [
        {
          id: 'c10l2-s1',
          type: 'goal',
          content: {
            text: '你能根据“输入、输出、是否有返回值”选择标准函数式接口，并用 andThen / compose / negate 组合它们。',
            checklist: ['区分四大接口的签名', '知道 Predicate 返回 boolean', '会用 andThen 串联 Function'],
          },
        },
        {
          id: 'c10l2-s2',
          type: 'concept',
          content: {
            title: '四个最常用的形状',
            paragraphs: [
              '`Function<T, R>`：接收 T，返回 R；`R apply(T t)`。',
              '`Predicate<T>`：接收 T，返回 boolean；`boolean test(T t)`，常用于过滤。',
              '`Consumer<T>`：接收 T，不返回；`void accept(T t)`，常用于打印或写入。',
              '`Supplier<T>`：不接收参数，返回 T；`T get()`，常用于延迟创建或提供默认值。',
              '还有 `BiFunction`（两个输入）、`UnaryOperator`（同类型输入输出）、`BinaryOperator`，以及 `IntFunction` 等基本类型特化接口。',
              '组合：Function 用 `andThen` / `compose`；Predicate 用 `and` / `or` / `negate`。组合返回新的函数对象，不立即执行。',
            ],
            table: {
              headers: ['接口', '签名', '典型用途'],
              rows: [
                ['`Function<T,R>`', '`R apply(T)`', '转换、映射'],
                ['`Predicate<T>`', '`boolean test(T)`', '过滤、条件判断'],
                ['`Consumer<T>`', '`void accept(T)`', '打印、写入副作用'],
                ['`Supplier<T>`', '`T get()`', '延迟创建、默认值'],
                ['`UnaryOperator<T>`', '`T apply(T)`', '同类型转换'],
              ],
            },
            note: '接口选择看形状：有输入有输出用 Function；有输入无输出用 Consumer；无输入有输出用 Supplier；输出 boolean 用 Predicate。',
          },
        },
        {
          id: 'c10l2-s3',
          type: 'example',
          content: {
            scenarios: [
              {
                name: '场景 1：四种标准接口',
                code: `import java.util.function.Consumer;
import java.util.function.Function;
import java.util.function.Predicate;
import java.util.function.Supplier;

public class StandardFunctions {
    public static void main(String[] args) {
        Function<String, Integer> length = String::length;
        Predicate<String> shortName = name -> name.length() <= 3;
        Consumer<String> printer = System.out::println;
        Supplier<String> source = () -> "java";

        System.out.println(length.apply("hello"));
        System.out.println(shortName.test("Ada"));
        printer.accept("done");
        System.out.println(source.get());
    }
}`,
                output: '5\ntrue\ndone\njava',
                lineNotes: {
                  8: 'Function 把 String 转成 Integer。',
                  9: 'Predicate 判断字符串长度是否不超过 3。',
                  10: 'Consumer 接收字符串并打印。',
                  11: 'Supplier 延迟提供字符串。',
                  13: 'apply 接收输入并返回结果。',
                  14: 'test 返回 boolean。',
                  15: 'accept 没有返回值。',
                  16: 'get 不需要输入。',
                },
                takeaway: '**一般规则**：按签名选接口：T→R 用 Function，T→boolean 用 Predicate，T→void 用 Consumer，()→T 用 Supplier。',
              },
              {
                name: '场景 2：组合函数',
                code: `import java.util.function.Function;
import java.util.function.Predicate;

public class ComposeDemo {
    public static void main(String[] args) {
        Function<Integer, Integer> doubleIt = x -> x * 2;
        Function<Integer, Integer> plusOne = x -> x + 1;
        Predicate<Integer> positive = x -> x > 0;

        System.out.println(doubleIt.andThen(plusOne).apply(5));
        System.out.println(positive.negate().test(3));
    }
}`,
                output: '11\nfalse',
                lineNotes: {
                  6: '先乘 2。',
                  7: '再加 1。',
                  8: '判断是否大于 0。',
                  10: 'andThen 先执行 doubleIt，再把结果交给 plusOne：5→10→11。',
                  11: 'negate 取反：3 是正数，取反后为 false。',
                },
                takeaway: '**一般规则**：组合操作返回新函数；andThen 的顺序是“当前函数 → 参数函数”。',
              },
            ],
          },
        },
        {
          id: 'c10l2-s4',
          type: 'quiz',
          content: {
            kind: 'choice',
            question: '需要“接收一个字符串、返回它是否为空”的函数，应使用哪个接口？',
            options: ['`Function<String, Boolean>`', '`Predicate<String>`', '`Consumer<String>`', '`Supplier<Boolean>`'],
            answerIndex: 1,
            explanation: 'Predicate<T> 的 test 返回 boolean，语义就是判断；Function 也能返回 Boolean，但 Predicate 更贴合“条件”。',
          },
        },
        {
          id: 'c10l2-s5',
          type: 'coding',
          content: {
            exerciseId: 'c10l2-even',
            task: '读入 n 个整数，用 `Predicate<Integer>` 判断偶数，输出偶数的个数。',
            io: `输入：n，随后 n 个整数
输出：偶数数量
样例：输入 "5 1 2 3 4 5" → 输出 2
约束：必须使用 Predicate 与 test。`,
            skeleton: `import java.util.function.Predicate;
import java.util.Scanner;

public class Main {
    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);
        int n = scanner.nextInt();
        Predicate<Integer> isEven = value -> value % 2 == 0;
        int count = 0;
        for (int i = 0; i < n; i++) {
            int value = scanner.nextInt();
            // 用 isEven.test 判断并计数
        }
        System.out.println(count);
    }
}`,
            hints: [
              '概念回顾：Predicate.test 返回 boolean。',
              '解题方向：if (isEven.test(value)) count++。',
              '关键 API：`Predicate.test`。',
            ],
            tests: [
              {
                label: '混合奇偶',
                kind: 'normal',
                stdin: '5 1 2 3 4 5\n',
                expectedStdout: '2\n',
              },
              {
                label: '全是奇数',
                kind: 'edge',
                stdin: '2 1 3\n',
                expectedStdout: '0\n',
              },
              {
                label: '包含负数与 0',
                kind: 'tricky',
                stdin: '4 -2 0 1 2\n',
                expectedStdout: '3\n',
              },
            ],
            answer: `import java.util.function.Predicate;
import java.util.Scanner;

public class Main {
    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);
        int n = scanner.nextInt();
        Predicate<Integer> isEven = value -> value % 2 == 0;
        int count = 0;
        for (int i = 0; i < n; i++) {
            int value = scanner.nextInt();
            if (isEven.test(value)) {
                count++;
            }
        }
        System.out.println(count);
    }
}`,
            answerWhy:
              'Predicate 把“判断偶数”封装成一个可传递的规则；主循环只负责读取与计数。负数和 0 也满足 `% 2 == 0`，所以测试覆盖了边界。',
          },
        },
        {
          id: 'c10l2-s6',
          type: 'summary',
          content: {
            points: [
              {
                kind: 'general',
                text: '**一般规则**：Function 转换、Predicate 判断、Consumer 消费、Supplier 提供；按签名选接口。',
              },
              {
                kind: 'general',
                text: '**一般规则**：组合操作 andThen / compose / negate 返回新函数，不立即执行。',
              },
              {
                kind: 'general',
                text: '**一般规则**：能用标准接口就不要自定义；标准接口更易读、可组合、与 Stream 兼容。',
              },
              {
                kind: 'scenario',
                text: '四种标准接口展示签名差异；andThen / negate 展示组合。',
              },
            ],
          },
        },
        {
          id: 'c10l2-s7',
          type: 'pitfall',
          content: {
            items: [
              {
                wrong: '把 `Function<String, Boolean>` 当作过滤条件传给 `Stream.filter`。',
                why: 'filter 接收 Predicate，不是 Function；类型不匹配，编译失败。',
                right: '用 `Predicate<String>`，或把 Function 结果再转成 Predicate。',
              },
              {
                wrong: '以为 andThen 会立刻执行函数。',
                why: '组合只构造新的函数对象，apply 时才执行。',
                right: '先组合，再对具体输入调用 apply。',
              },
              {
                wrong: '在 Consumer 里做重要计算，期待返回值。',
                why: 'Consumer 的 accept 返回 void，计算结果无法直接传出。',
                right: '需要返回值用 Function；副作用用 Consumer 要谨慎。',
              },
            ],
          },
        },
      ],
    },
    {
      id: 'c10l3',
      chapter: 10,
      title: '方法引用 :: 的四种形式',
      summary: '方法引用是 lambda 的简写：静态方法、绑定实例、未绑定实例、构造器；前提是 lambda 只做一次方法调用。',
      steps: [
        {
          id: 'c10l3-s1',
          type: 'goal',
          content: {
            text: '你能识别并写出四种方法引用，把只调用现有方法的 lambda 改成 `::`，并知道何时不能使用。',
            checklist: ['区分四种形式', '知道 `类名::静态方法` 与 `类名::实例方法` 的差异', '知道构造器引用'],
          },
        },
        {
          id: 'c10l3-s2',
          type: 'concept',
          content: {
            title: '四种形态',
            paragraphs: [
              '**静态方法引用**：`Integer::parseInt`，等价于 `s -> Integer.parseInt(s)`。',
              '**绑定实例方法引用**：`prefix::concat`，实例已经确定，等价于 `s -> prefix.concat(s)`。',
              '**未绑定实例方法引用**：`String::toUpperCase`，第一个参数成为接收者，等价于 `s -> s.toUpperCase()`。',
              '**构造器引用**：`ArrayList::new`，等价于 `() -> new ArrayList<>()`；`StringBuilder::new` 同理。',
              '方法引用要求 lambda 只做一次方法调用，参数按位置对应；如果还有额外逻辑（如拼接、判断），就不能直接替换。',
              '方法引用不是“更高级”，只是更短；可读性优先，复杂逻辑仍用 lambda。',
            ],
            table: {
              headers: ['形式', '写法', '等价 lambda'],
              rows: [
                ['静态方法', '`Integer::parseInt`', '`s -> Integer.parseInt(s)`'],
                ['绑定实例', '`prefix::concat`', '`s -> prefix.concat(s)`'],
                ['未绑定实例', '`String::toUpperCase`', '`s -> s.toUpperCase()`'],
                ['构造器', '`ArrayList::new`', '`() -> new ArrayList<>()`'],
              ],
            },
            note: '“绑定”看实例是否已经存在：`prefix::concat` 绑定到 prefix；`String::toUpperCase` 的接收者来自参数。',
          },
        },
        {
          id: 'c10l3-s3',
          type: 'example',
          content: {
            scenarios: [
              {
                name: '场景 1：静态方法与构造器引用',
                code: `import java.util.ArrayList;
import java.util.function.Function;
import java.util.function.Supplier;

public class MethodRefDemo {
    public static void main(String[] args) {
        Function<String, Integer> parse = Integer::parseInt;
        Supplier<ArrayList<String>> factory = ArrayList::new;

        System.out.println(parse.apply("42"));
        System.out.println(factory.get().size());
    }
}`,
                output: '42\n0',
                lineNotes: {
                  7: '静态方法引用：参数直接作为 parseInt 的输入。',
                  8: '构造器引用：每次 get 创建新的空 ArrayList。',
                  10: '解析字符串。',
                  11: '新列表大小为 0。',
                },
                takeaway: '**一般规则**：静态方法用 `类名::方法`；无参构造器用 `类名::new`。',
              },
              {
                name: '场景 2：绑定与未绑定实例方法引用',
                code: `import java.util.function.Function;
import java.util.function.UnaryOperator;

public class BoundRefDemo {
    public static void main(String[] args) {
        String prefix = "ID-";
        Function<String, String> bound = prefix::concat;
        UnaryOperator<String> upper = String::toUpperCase;

        System.out.println(bound.apply("7"));
        System.out.println(upper.apply("java"));
    }
}`,
                output: 'ID-7\nJAVA',
                lineNotes: {
                  6: 'prefix 是已经存在的实例。',
                  7: '绑定实例引用：调用 prefix.concat(参数)。',
                  8: '未绑定实例引用：参数成为 toUpperCase 的接收者。',
                  10: '得到 ID-7。',
                  11: '得到 JAVA。',
                },
                takeaway: '**一般规则**：绑定实例引用固定接收者；未绑定实例引用的接收者来自第一个参数。',
              },
            ],
          },
        },
        {
          id: 'c10l3-s4',
          type: 'quiz',
          content: {
            kind: 'choice',
            question: '`ArrayList::new` 属于哪种方法引用？',
            options: ['静态方法引用', '绑定实例方法引用', '未绑定实例方法引用', '构造器引用'],
            answerIndex: 3,
            explanation: '`new` 表示构造器引用；它与 `() -> new ArrayList<>()` 等价。',
          },
        },
        {
          id: 'c10l3-s5',
          type: 'coding',
          content: {
            exerciseId: 'c10l3-sortby',
            task: '读入 n 个单词，用 `Comparator.comparingInt(String::length)` 按长度升序排序，输出列表 toString。',
            io: `输入：n，随后 n 个单词
输出：按长度排序后的列表
样例：输入 "3 bb a ccc" → 输出 [a, bb, ccc]
约束：排序规则必须使用方法引用 String::length。`,
            skeleton: `import java.util.ArrayList;
import java.util.Comparator;
import java.util.List;
import java.util.Scanner;

public class Main {
    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);
        int n = scanner.nextInt();
        List<String> words = new ArrayList<>();
        for (int i = 0; i < n; i++) {
            words.add(scanner.next());
        }
        // 按长度排序
        System.out.println(words);
    }
}`,
            hints: [
              '概念回顾：`String::length` 是未绑定实例方法引用，参数是接收者。',
              '解题方向：`words.sort(Comparator.comparingInt(String::length));`。',
              '关键 API：`Comparator.comparingInt`、`List.sort`。',
            ],
            tests: [
              {
                label: '长度递增',
                kind: 'normal',
                stdin: '3 bb a ccc\n',
                expectedStdout: '[a, bb, ccc]\n',
              },
              {
                label: '只有一个词',
                kind: 'edge',
                stdin: '1 solo\n',
                expectedStdout: '[solo]\n',
              },
              {
                label: '同长度保持相对顺序',
                kind: 'tricky',
                stdin: '4 dd bb a ccc\n',
                expectedStdout: '[a, dd, bb, ccc]\n',
              },
            ],
            answer: `import java.util.ArrayList;
import java.util.Comparator;
import java.util.List;
import java.util.Scanner;

public class Main {
    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);
        int n = scanner.nextInt();
        List<String> words = new ArrayList<>();
        for (int i = 0; i < n; i++) {
            words.add(scanner.next());
        }
        words.sort(Comparator.comparingInt(String::length));
        System.out.println(words);
    }
}`,
            answerWhy:
              '`comparingInt` 需要一个把元素转成 int 的 Function；`String::length` 正好是未绑定实例引用。List.sort 是稳定排序，同长度元素保持输入顺序。',
          },
        },
        {
          id: 'c10l3-s6',
          type: 'summary',
          content: {
            points: [
              {
                kind: 'general',
                text: '**一般规则**：方法引用是“只调用一个现有方法”的 lambda 简写，不是新语义。',
              },
              {
                kind: 'general',
                text: '**一般规则**：静态用 `类::静态方法`，绑定实例用 `实例::方法`，未绑定实例用 `类::实例方法`，构造器用 `类::new`。',
              },
              {
                kind: 'general',
                text: '**一般规则**：参数位置必须能一一对应；有额外逻辑时保留 lambda。',
              },
              {
                kind: 'scenario',
                text: 'parseInt / ArrayList::new 展示静态与构造器；concat / toUpperCase 展示绑定与未绑定。',
              },
            ],
          },
        },
        {
          id: 'c10l3-s7',
          type: 'pitfall',
          content: {
            items: [
              {
                wrong: '`String::length` 用在需要 `Function<String, Integer>` 的地方，却写成 `String::length()`。',
                why: '方法引用不能带括号调用；括号形式是普通方法调用，类型不匹配。',
                right: '写 `String::length`。',
              },
              {
                wrong: '把 `prefix::concat` 与 `String::concat` 混为一谈。',
                why: '前者绑定到已有实例 prefix；后者需要两个参数（接收者 + 参数）。',
                right: '根据目标接口的参数个数选择绑定或未绑定形式。',
              },
              {
                wrong: 'lambda 里还有判断逻辑，却强行改成方法引用。',
                why: '方法引用只能表达一次现有方法调用，无法承载额外逻辑。',
                right: '保留 lambda，可读性优先。',
              },
            ],
          },
        },
      ],
    },
  ],
}
