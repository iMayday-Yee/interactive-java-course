import type { Chapter } from '../../types/content'

export const chapter01: Chapter = {
  id: 'chapter-1',
  number: 1,
  title: '基础语法速通',
  subtitle: '你已有 C / Python / Go 基础，这里只补 Java 的差异与固定规则。',
  lessons: [
    {
      id: 'c1l1',
      chapter: 1,
      title: '基本类型与变量',
      summary: 'Java 的 8 种基本类型位宽固定；变量声明必须带类型，final 表示一次赋值后不可改。',
      steps: [
        {
          id: 'c1l1-s1',
          type: 'goal',
          content: {
            text: '你能列出 8 种基本类型与位宽，把 Go 的类型映射到 Java，并写出正确的变量声明。',
            checklist: ['记住 int 永远是 32 位', '区分 byte 与 Go 的 byte', '知道字面量后缀 L / f 的作用'],
          },
        },
        {
          id: 'c1l1-s2',
          type: 'concept',
          content: {
            title: '8 种基本类型，位宽固定',
            paragraphs: [
              'Java 的基本类型不是对象，直接存值；它们的位宽由语言规范固定，**不随平台变化**。',
              '`byte` 8 位、`short` 16 位、`int` 32 位、`long` 64 位；`float` 32 位、`double` 64 位；`char` 16 位（UTF-16 码元）；`boolean` 只有 true/false。',
              '与 Go 不同，Java 的 `int` **永远是 32 位**；Go 的 `int` 位宽依赖目标平台。',
              '整数字面量默认是 `int`；超出 int 范围要加 `L` 后缀写成 long。浮点字面量默认是 `double`；float 要加 `f`。',
            ],
            table: {
              headers: ['类型', '位宽', '取值范围 / 说明', '示例'],
              rows: [
                ['byte', '8', '-128 ~ 127', '`byte b = 100;`'],
                ['short', '16', '-32768 ~ 32767', '`short s = 30000;`'],
                ['int', '32', '-2^31 ~ 2^31-1', '`int n = 42;`'],
                ['long', '64', '-2^63 ~ 2^63-1', '`long x = 42L;`'],
                ['float', '32', 'IEEE 754 单精度', '`float f = 1.5f;`'],
                ['double', '64', 'IEEE 754 双精度', '`double d = 1.5;`'],
                ['char', '16', '单个 UTF-16 码元', "`char c = 'A';`"],
                ['boolean', 'JVM 相关', 'true / false', '`boolean ok = true;`'],
              ],
            },
            note: '`char` 是无符号的 16 位整数，但它是字符类型；不要把它和 Go 的 `rune`（32 位 Unicode 码点）混为一谈。',
          },
        },
        {
          id: 'c1l1-s3',
          type: 'concept',
          content: {
            title: '与 Go 类型对照',
            paragraphs: [
              'Go 的 `int32` / `int64` 分别对应 Java 的 `int` / `long`；Go 的 `int` 没有固定位宽。',
              'Go 的 `byte` 是 `uint8` 的别名，Java 的 `byte` 是**有符号**的 -128~127。',
              'Go 的 `rune` 是 Unicode 码点（32 位），Java 的 `char` 是 UTF-16 码元（16 位）；一个增补字符在 Java 中可能需要两个 char。',
              'Go 的 `string` 对应 Java 的 `String`，但 Java 的 `String` 是对象，不是基本类型。',
            ],
            table: {
              headers: ['Go', 'Java', '说明'],
              rows: [
                ['`int32`', '`int`', '都是 32 位有符号整数'],
                ['`int64`', '`long`', '都是 64 位有符号整数'],
                ['`byte`（uint8）', '`byte`（有符号）', 'Java 的 byte 范围是 -128~127'],
                ['`rune`', '`char`', 'rune 是码点，char 是 UTF-16 码元'],
                ['`bool`', '`boolean`', '只有 true/false'],
                ['`string`', '`String`', 'Java 的 String 是引用类型'],
              ],
            },
          },
        },
        {
          id: 'c1l1-s4',
          type: 'example',
          content: {
            intro: '两个场景分别看浮点提升与整数范围。',
            scenarios: [
              {
                name: '场景 1：温度转换（double 与 int）',
                code: `public class Temperature {
    public static void main(String[] args) {
        int celsius = 37;
        double fahrenheit = celsius * 9.0 / 5 + 32;
        System.out.println(celsius + "C = " + fahrenheit + "F");
    }
}`,
                output: '37C = 98.6F',
                lineNotes: {
                  3: '`int celsius = 37;`：整数字面量默认 int；变量声明必须写类型。',
                  4: '`9.0 / 5`：因为 9.0 是 double，5 会自动提升为 double，结果是 1.8；若写 `9 / 5` 会做整数除法得到 1。',
                  5: '字符串拼接会把 double 转成文本。',
                },
                takeaway:
                  '**一般规则**：二元运算中只要有一个操作数是浮点类型，另一个会提升为浮点；整数除法会截断小数。',
              },
              {
                name: '场景 2：金额用 long 表示分',
                code: `public class Money {
    public static void main(String[] args) {
        long priceCents = 1999L;
        int quantity = 3;
        long total = priceCents * quantity;
        System.out.println("总价: " + total + " 分");
    }
}`,
                output: '总价: 5997 分',
                lineNotes: {
                  3: '`1999L` 的 `L` 后缀把字面量标成 long；没有后缀时默认 int。',
                  4: '`int quantity` 是 32 位整数。',
                  5: 'long 与 int 相乘，int 提升为 long，结果不会溢出 int。',
                },
                takeaway:
                  '**一般规则**：可能超过 int 范围的量用 long；字面量加 L 明确类型，避免先按 int 计算再溢出。',
              },
            ],
          },
        },
        {
          id: 'c1l1-s5',
          type: 'quiz',
          content: {
            kind: 'choice',
            question: '下面哪条声明在 Java 中合法？',
            options: [
              '`long n = 3000000000;`',
              '`long n = 3000000000L;`',
              '`int n = 3000000000L;`',
              '`float f = 1.5;`',
            ],
            answerIndex: 1,
            explanation:
              '3000000000 超出 int 范围，必须加 L 才是 long 字面量；把 long 赋给 int 需要强制转换；1.5 默认是 double，赋给 float 必须写 1.5f。',
          },
        },
        {
          id: 'c1l1-s6',
          type: 'coding',
          content: {
            exerciseId: 'c1l1-sum',
            task: '读入两个 32 位整数，输出它们的和。结果可能超出 int 范围，请用 long 保存并输出。',
            io: `输入：两个整数，以空白分隔
输出：它们的和
样例：输入 "2000000000 2000000000" → 输出 4000000000
约束：输入在 int 范围内，但和可能超过 int。`,
            skeleton: `import java.util.Scanner;

public class Main {
    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);
        // 读取两个 int，用 long 计算和
    }
}`,
            hints: [
              '概念回顾：`int + int` 的结果仍是 int，先溢出再赋给 long 就晚了。',
              '解题方向：直接读成 long 最省事；或者把至少一个操作数转成 long 再相加。',
              '关键 API：`Scanner.nextLong` 或强制转换 `(long)`。',
            ],
            tests: [
              {
                label: '普通相加',
                kind: 'normal',
                stdin: '3 5\n',
                expectedStdout: '8\n',
              },
              {
                label: '超过 int 上限',
                kind: 'edge',
                stdin: '2000000000 2000000000\n',
                expectedStdout: '4000000000\n',
              },
              {
                label: '低于 int 下限',
                kind: 'tricky',
                stdin: '-2147483648 -1\n',
                expectedStdout: '-2147483649\n',
              },
            ],
            answer: `import java.util.Scanner;

public class Main {
    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);
        long a = scanner.nextLong();
        long b = scanner.nextLong();
        System.out.println(a + b);
    }
}`,
            answerWhy:
              '直接读成 long 最省事。如果必须读 int，也要在相加前把至少一个操作数转成 long，否则加法先按 int 计算并溢出。',
          },
        },
        {
          id: 'c1l1-s7',
          type: 'summary',
          content: {
            points: [
              {
                kind: 'general',
                text: '**一般规则**：Java 基本类型位宽固定；需要跨平台一致的范围时，选 Java 的 int / long 而不是依赖平台相关类型。',
              },
              {
                kind: 'general',
                text: '**一般规则**：整数字面量默认 int，超出范围加 L；浮点字面量默认 double，float 加 f。',
              },
              {
                kind: 'general',
                text: '**一般规则**：混合运算会向更宽的类型提升；整数除法会截断小数；溢出不会抛异常，只会回绕。',
              },
              {
                kind: 'scenario',
                text: '温度转换与金额计算分别展示了浮点提升和大整数范围的取舍。',
              },
            ],
          },
        },
        {
          id: 'c1l1-s8',
          type: 'pitfall',
          content: {
            items: [
              {
                wrong: 'int total = 2000000000 + 2000000000;',
                why: '两个 int 相加先按 int 计算，结果溢出回绕，再赋给 int 已经错了。',
                right: 'long total = 2000000000L + 2000000000L;',
              },
              {
                wrong: 'float f = 1.5;',
                why: '1.5 是 double 字面量，不能自动收窄为 float。',
                right: 'float f = 1.5f;',
              },
              {
                wrong: "char c = '中';  // 认为 char 能表示所有 Unicode",
                why: 'char 是 16 位 UTF-16 码元；增补字符需要两个 char（代理对）。',
                right: '需要完整码点时用 int codePoint 或 String.codePointAt。',
              },
            ],
          },
        },
      ],
    },
    {
      id: 'c1l2',
      chapter: 1,
      title: '运算符、类型转换与流程控制',
      summary: '类型转换有自动提升与强制收窄；流程控制与 switch 表达式按条件选择分支。',
      steps: [
        {
          id: 'c1l2-s1',
          type: 'goal',
          content: {
            text: '你能写出正确的类型转换，使用 if/else、switch 表达式与循环，并避开 == 比较字符串的坑。',
            checklist: ['知道自动提升的方向', '理解强制转换的精度丢失', '会用 switch 表达式'],
          },
        },
        {
          id: 'c1l2-s2',
          type: 'concept',
          content: {
            title: '运算符与类型转换',
            paragraphs: [
              '算术运算符 `+ - * / %`；整数除法截断小数，`%` 取余。',
              '比较运算符返回 `boolean`；逻辑运算符 `&& || !` 支持短路求值。',
              '**自动类型提升**：byte→short→int→long→float→double；小范围赋给大范围是安全的。',
              '**强制类型转换**：`(int) 3.9` 截断为 3；把大范围塞进小范围可能丢失精度或回绕。',
              '`==` 对基本类型比较值；对引用类型比较**是否指向同一个对象**。字符串内容比较必须用 `.equals()`，第 2 章展开。',
            ],
            table: {
              headers: ['写法', '结果', '说明'],
              rows: [
                ['`7 / 2`', '`3`', 'int 除法截断'],
                ['`7 / 2.0`', '`3.5`', 'int 提升为 double'],
                ['`(int) 3.9`', '`3`', '强制转换截断小数'],
                ['`(byte) 130`', '`-126`', '超出范围回绕（130 - 256）'],
                ['`"a" == "a"`', '通常 true（常量池）', '不要依赖它比较内容'],
                ['`"a".equals("a")`', 'true', '内容比较的正确方式'],
              ],
            },
          },
        },
        {
          id: 'c1l2-s3',
          type: 'concept',
          content: {
            title: '流程控制与 switch 表达式',
            paragraphs: [
              '`if / else if / else` 按条件分支；`for`、增强 `for`、`while`、`do-while` 用于循环。',
              '传统 `switch` 语句需要 `break`，否则会贯穿到下一个 case。',
              'Java 14 起有 **switch 表达式**：用 `->` 分支，整个 switch 产生一个值；多行分支用 `yield` 返回值。需要 Java 14+。',
              '`switch` 支持 byte/short/char/int、其包装类、String、enum；不支持 long。',
            ],
            table: {
              headers: ['结构', '用途', '注意'],
              rows: [
                ['`if / else`', '任意布尔条件', '条件必须是 boolean，不能写 `if (1)`'],
                ['`for (int i = 0; i < n; i++)`', '已知次数的循环', '下标 0 到 n-1'],
                ['增强 for', '遍历数组 / 集合', '只读遍历，拿不到下标'],
                ['`switch` 语句', '多分支', '忘记 break 会贯穿'],
                ['`switch` 表达式（Java 14+）', '多分支并产生值', '用 `->`；多行用 `yield`'],
              ],
            },
          },
        },
        {
          id: 'c1l2-s4',
          type: 'example',
          content: {
            intro: '一个 switch 表达式，一个循环与转换。',
            scenarios: [
              {
                name: '场景 1：成绩等级（switch 表达式，Java 14+）',
                javaVersion: 'Java 14',
                code: `public class Grade {
    public static void main(String[] args) {
        int score = 87;
        String level = switch (score / 10) {
            case 10, 9 -> "A";
            case 8 -> "B";
            case 7 -> "C";
            default -> "D";
        };
        System.out.println(level);
    }
}`,
                output: 'B',
                lineNotes: {
                  3: '`score` 是 87。',
                  4: '`switch` 表达式直接产生值；`score / 10` 是 int 除法，得到 8。',
                  5: '`case 10, 9 -> "A";` 一个分支匹配多个值；箭头形式不会贯穿。',
                  8: '`default` 覆盖剩余情况；switch 表达式必须穷尽所有可能，否则编译错误。',
                  9: '把 switch 的结果赋给 String。',
                },
                takeaway:
                  '**一般规则**：switch 表达式把“选择”变成“产生一个值”，适合赋值场景；传统 switch 语句适合执行副作用。',
              },
              {
                name: '场景 2：循环累加与强制转换',
                code: `public class Average {
    public static void main(String[] args) {
        int[] scores = {80, 90, 70};
        int sum = 0;
        for (int score : scores) {
            sum += score;
        }
        double average = (double) sum / scores.length;
        System.out.println(average);
    }
}`,
                output: '80.0',
                lineNotes: {
                  3: '数组字面量用 `{}` 初始化；数组长度固定。',
                  4: '累加器从 0 开始。',
                  5: '增强 for 依次取出元素；这里拿不到下标。',
                  6: '`sum += score` 等价于 `sum = sum + score`。',
                  8: '`(double) sum` 先把 sum 转成 double，再做除法；`scores.length` 是数组长度字段，不是方法。',
                },
                takeaway:
                  '**一般规则**：先强制转换再参与除法，才能得到小数结果；`(double)(sum / n)` 会先做整数除法，顺序不同结果不同。',
              },
            ],
          },
        },
        {
          id: 'c1l2-s5',
          type: 'quiz',
          content: {
            kind: 'judge',
            statement: '在 Java 中，`if (1)` 是合法的条件写法。',
            answer: false,
            explanation: 'Java 的条件必须是 boolean；C 里“非零即真”的写法在 Java 中不成立。',
          },
        },
        {
          id: 'c1l2-s6',
          type: 'quiz',
          content: {
            kind: 'choice',
            question: '`int a = 7; int b = 2; double result = a / b;` 的 result 是多少？',
            options: ['3.5', '3.0', '4.0', '编译错误'],
            answerIndex: 1,
            explanation:
              '`a / b` 先按 int 计算得到 3，再赋给 double 变成 3.0；要得到 3.5 必须写 `(double) a / b`。',
          },
        },
        {
          id: 'c1l2-s7',
          type: 'coding',
          content: {
            exerciseId: 'c1l2-grade',
            task: '读入一个 0~100 的整数分数，输出等级：90~100 → `A`，80~89 → `B`，70~79 → `C`，60~69 → `D`，0~59 → `E`。',
            io: `输入：一个整数 score
输出：一个大写等级字母
样例：输入 87 → 输出 B
约束：0 ≤ score ≤ 100。`,
            skeleton: `import java.util.Scanner;

public class Main {
    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);
        int score = scanner.nextInt();
        // 按分数区间输出等级
    }
}`,
            hints: [
              '边界值要特别小心：90 属于 A，80 属于 B，60 属于 D。',
              '按从高到低判断最不容易漏：先 `if (score >= 90)`，再 `else if (score >= 80)`……',
              '关键 API：`if / else if / else`、`System.out.println`。',
            ],
            tests: [
              {
                label: '中间分数',
                kind: 'normal',
                stdin: '87\n',
                expectedStdout: 'B\n',
              },
              {
                label: 'D 的下边界',
                kind: 'edge',
                stdin: '60\n',
                expectedStdout: 'D\n',
              },
              {
                label: '满分',
                kind: 'tricky',
                stdin: '100\n',
                expectedStdout: 'A\n',
              },
            ],
            answer: `import java.util.Scanner;

public class Main {
    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);
        int score = scanner.nextInt();
        if (score >= 90) {
            System.out.println("A");
        } else if (score >= 80) {
            System.out.println("B");
        } else if (score >= 70) {
            System.out.println("C");
        } else if (score >= 60) {
            System.out.println("D");
        } else {
            System.out.println("E");
        }
    }
}`,
            answerWhy:
              '从高到低判断时，每个分支只需要写下界，因为上面的条件已经排除了更高的区间；边界值 90、80、70、60 都落在正确分支。',
          },
        },
        {
          id: 'c1l2-s8',
          type: 'summary',
          content: {
            points: [
              {
                kind: 'general',
                text: '**一般规则**：小范围到大范围自动提升；大范围到小范围需要强制转换，并承担精度丢失或回绕的风险。',
              },
              {
                kind: 'general',
                text: '**一般规则**：整数除法先截断再参与后续计算；需要小数时，先转换至少一个操作数。',
              },
              {
                kind: 'general',
                text: '**一般规则**：switch 表达式用 `->` 产生值并强制穷尽分支；传统 switch 语句要记得 break。',
              },
              {
                kind: 'general',
                text: '**一般规则**：`==` 比较引用是否同一对象，字符串内容比较用 `.equals()`。',
              },
              {
                kind: 'scenario',
                text: '成绩等级与平均值计算分别展示了分支选择和转换顺序的重要性。',
              },
            ],
          },
        },
        {
          id: 'c1l2-s9',
          type: 'pitfall',
          content: {
            items: [
              {
                wrong: 'if (score = 100) { ... }',
                why: '`=` 是赋值，不是比较；Java 要求条件为 boolean，赋值 int 不能作为条件。',
                right: 'if (score == 100) { ... }',
              },
              {
                wrong: 'double avg = sum / count;',
                why: '两个 int 先做整数除法，小数部分已经丢失，再赋给 double 也补不回来。',
                right: 'double avg = (double) sum / count;',
              },
              {
                wrong: 'String a = "x"; if (a == "x") ...',
                why: '`==` 比较引用；字符串内容应使用 equals。第 2 章会解释常量池为什么有时看起来“能用”。',
                right: 'if ("x".equals(a)) { ... }',
              },
            ],
          },
        },
      ],
    },
    {
      id: 'c1l3',
      chapter: 1,
      title: '数组与方法',
      summary: '数组是定长对象，length 是字段；方法支持重载与可变参数。',
      steps: [
        {
          id: 'c1l3-s1',
          type: 'goal',
          content: {
            text: '你能声明、遍历、复制数组，写出可变参数方法，并解释重载的选择规则。',
            checklist: ['区分 length 与 length()', '理解二维数组是数组的数组', '知道重载在编译期决定'],
          },
        },
        {
          id: 'c1l3-s2',
          type: 'concept',
          content: {
            title: '数组是对象，长度固定',
            paragraphs: [
              '`int[] numbers = new int[5];` 创建一个长度为 5 的数组，元素自动初始化为 0。',
              '`numbers.length` 是**字段**，不是方法；字符串才是 `length()`。',
              '下标从 0 开始，合法范围是 `0 ~ length-1`；越界抛 `ArrayIndexOutOfBoundsException`。',
              '二维数组是“数组的数组”：`int[][] grid = new int[3][4];`，每一行是独立的一维数组。',
              '`java.util.Arrays` 提供 `toString`、`sort`、`copyOf`、`equals` 等工具。',
            ],
            table: {
              headers: ['操作', '写法', '说明'],
              rows: [
                ['创建', '`int[] a = new int[3];`', '元素默认 0'],
                ['长度', '`a.length`', '字段，不是方法'],
                ['复制', '`Arrays.copyOf(a, a.length)`', '返回新数组'],
                ['排序', '`Arrays.sort(a)`', '原地排序'],
                ['打印', '`Arrays.toString(a)`', '直接打印数组对象只会得到地址样式'],
              ],
            },
          },
        },
        {
          id: 'c1l3-s3',
          type: 'concept',
          content: {
            title: '方法与重载、可变参数',
            paragraphs: [
              '方法签名由**方法名 + 参数类型列表**组成；返回类型不参与重载判断。',
              '**重载（Overloading）**：同一个类中，方法名相同、参数列表不同。编译器按实参的静态类型选择最匹配的方法。',
              '**可变参数** `int... values` 在方法内部就是 `int[]`；一个方法最多一个可变参数，且必须放在参数列表最后。',
              'Java 没有默认参数；需要可选参数时，用重载或可变参数。',
            ],
            table: {
              headers: ['概念', 'Java', 'Go', 'Python'],
              rows: [
                ['函数 / 方法定义', '类中的方法', '函数或方法', 'def'],
                ['重载', '支持（同名不同参）', '不支持同名函数', '后定义覆盖，不重载'],
                ['可变参数', '`int... values`', '`values ...int`', '`*args`'],
                ['默认参数', '不支持', '不支持', '支持'],
              ],
            },
          },
        },
        {
          id: 'c1l3-s4',
          type: 'example',
          content: {
            intro: '一个例子看数组与方法，一个例子看重载选择。',
            scenarios: [
              {
                name: '场景 1：数组统计（数组 + 方法）',
                code: `import java.util.Arrays;

public class Stats {
    static int sum(int[] values) {
        int total = 0;
        for (int value : values) {
            total += value;
        }
        return total;
    }

    public static void main(String[] args) {
        int[] scores = {80, 90, 70};
        System.out.println(Arrays.toString(scores));
        System.out.println(sum(scores));
    }
}`,
                output: '[80, 90, 70]\n240',
                lineNotes: {
                  1: 'import Arrays 工具类。',
                  4: '`static int sum(int[] values)`：静态方法，返回 int，接收一个 int 数组。',
                  5: '累加器。',
                  6: '增强 for 遍历数组。',
                  7: '把当前元素累加到 total。',
                  9: '返回结果。',
                  13: '数组字面量。',
                  14: '`Arrays.toString` 把数组内容格式化成 `[80, 90, 70]`。',
                  15: '调用方法；数组引用被复制一份传入，但指向同一个数组对象。',
                },
                takeaway:
                  '**一般规则**：方法是行为的最小复用单位；数组作为参数时，传入的是引用的副本，方法内修改元素会影响原数组。',
              },
              {
                name: '场景 2：可变参数与重载',
                code: `public class OverloadDemo {
    static int add(int a, int b) {
        return a + b;
    }

    static int add(int... values) {
        int total = 0;
        for (int value : values) {
            total += value;
        }
        return total;
    }

    public static void main(String[] args) {
        System.out.println(add(1, 2));
        System.out.println(add(1, 2, 3, 4));
    }
}`,
                output: '3\n10',
                lineNotes: {
                  2: '`add(int a, int b)`：两个固定参数的重载。',
                  6: '`add(int... values)`：可变参数版本，内部 `values` 是 int[]。',
                  15: '`add(1, 2)`：编译器优先选择固定参数版本，因为它更具体。',
                  16: '`add(1, 2, 3, 4)`：没有两个参数的匹配，选择可变参数版本。',
                },
                takeaway:
                  '**一般规则**：重载选择在编译期完成，按静态类型与参数数量匹配；更具体的固定参数优先于可变参数。',
              },
            ],
          },
        },
        {
          id: 'c1l3-s5',
          type: 'quiz',
          content: {
            kind: 'choice',
            question: '关于重载（Overloading），哪一项正确？',
            options: [
              '方法名相同、参数列表不同',
              '方法名相同、返回类型不同即可',
              '必须发生在父子类之间',
              '参数名不同也算重载',
            ],
            answerIndex: 0,
            explanation:
              '重载看方法名与参数类型列表；返回类型、参数名不参与判断。父子类之间的同名同参方法是重写（Overriding）。',
          },
        },
        {
          id: 'c1l3-s6',
          type: 'quiz',
          content: {
            kind: 'order',
            question: '把下面几行排成一个完整的可变参数求和方法（从上到下）。',
            lines: [
              'static int sum(int... values) {',
              '    int total = 0;',
              '    for (int value : values) {',
              '        total += value;',
              '    }',
              '    return total;',
              '}',
            ],
            explanation:
              '方法签名先声明，再初始化累加器，然后循环累加，最后返回并闭合方法。可变参数在方法内部就是数组。',
          },
        },
        {
          id: 'c1l3-s7',
          type: 'coding',
          content: {
            exerciseId: 'c1l3-sumvarargs',
            task: '实现 `static int sum(int... values)`，在 main 中读取一行整数（数量不定），输出它们的和。',
            io: `输入：一行整数，以空白分隔；可能为空行
输出：和；输入为空时输出 0
样例：输入 "1 2 3 4" → 输出 10
约束：使用可变参数方法完成累加。`,
            skeleton: `import java.util.Scanner;

public class Main {
    static int sum(int... values) {
        // 实现累加
        return 0;
    }

    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);
        String line = scanner.nextLine().trim();
        // 解析整数并调用 sum
    }
}`,
            hints: [
              '可变参数在方法内部就是数组 `int[]`，可以直接用增强 for 遍历。',
              '先 trim；如果为空，直接输出 0；否则用 `split("\\\\s+")` 分词，再逐个 `Integer.parseInt`。',
              '关键 API：`String.trim`、`String.split`、`Integer.parseInt`、`System.out.println`。',
            ],
            tests: [
              {
                label: '多个整数',
                kind: 'normal',
                stdin: '1 2 3 4\n',
                expectedStdout: '10\n',
              },
              {
                label: '空行',
                kind: 'edge',
                stdin: '\n',
                expectedStdout: '0\n',
              },
              {
                label: '多个空格',
                kind: 'tricky',
                stdin: ' 5   5 \n',
                expectedStdout: '10\n',
              },
            ],
            answer: `import java.util.Scanner;

public class Main {
    static int sum(int... values) {
        int total = 0;
        for (int value : values) {
            total += value;
        }
        return total;
    }

    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);
        String line = scanner.nextLine().trim();
        if (line.isEmpty()) {
            System.out.println(0);
            return;
        }
        String[] parts = line.split("\\\\s+");
        int[] numbers = new int[parts.length];
        for (int i = 0; i < parts.length; i++) {
            numbers[i] = Integer.parseInt(parts[i]);
        }
        System.out.println(sum(numbers));
    }
}`,
            answerWhy:
              '`sum(numbers)` 把整个 int[] 作为可变参数传入。空行单独处理，避免 `split` 得到空字符串后 `parseInt` 抛异常。',
          },
        },
        {
          id: 'c1l3-s8',
          type: 'summary',
          content: {
            points: [
              {
                kind: 'general',
                text: '**一般规则**：数组长度固定，`length` 是字段；越界检查是使用数组的前提。',
              },
              {
                kind: 'general',
                text: '**一般规则**：可变参数在方法内部就是数组；一个方法最多一个，且位于参数列表末尾。',
              },
              {
                kind: 'general',
                text: '**一般规则**：重载在编译期按方法名与参数列表选择，返回类型和参数名不参与。',
              },
              {
                kind: 'general',
                text: '**一般规则**：工具类 `Arrays` 负责数组的格式化、排序与复制，避免手写容易出错的循环。',
              },
              {
                kind: 'scenario',
                text: '统计与重载示例都说明：方法签名决定调用哪个实现，运行期不会“猜”你的意图。',
              },
            ],
          },
        },
        {
          id: 'c1l3-s9',
          type: 'pitfall',
          content: {
            items: [
              {
                wrong: 'int[] a = new int[3];\nSystem.out.println(a.length());',
                why: '数组长度是字段 `length`；`length()` 是 String 的方法。',
                right: 'System.out.println(a.length);',
              },
              {
                wrong: 'System.out.println(a);',
                why: '直接打印数组对象得到类似 `[I@1b6d3586` 的地址样式，不是元素内容。',
                right: 'System.out.println(Arrays.toString(a));',
              },
              {
                wrong: 'static int f(int... a, int b)',
                why: '可变参数必须是最后一个参数，且一个方法只能有一个。',
                right: 'static int f(int b, int... a)',
              },
            ],
          },
        },
      ],
    },
    {
      id: 'c1l4',
      chapter: 1,
      title: '参数传递专题',
      summary: 'Java 只有值传递；对象参数传入的是引用的副本，重新赋值形参不影响实参，但修改对象内容会影响。',
      steps: [
        {
          id: 'c1l4-s1',
          type: 'goal',
          content: {
            text: '你能用两个例子证明 Java 只有值传递，并解释“引用副本”与 C 指针的区别。',
            checklist: ['拒绝“Java 传引用”的错误说法', '区分改引用与改对象', '知道引用不能做指针算术'],
          },
        },
        {
          id: 'c1l4-s2',
          type: 'concept',
          content: {
            title: 'Java 只有值传递',
            paragraphs: [
              '**Java 只有值传递（pass-by-value）**。方法调用时，实参的值被复制一份赋给形参。',
              '基本类型：复制的是数值本身；方法内修改形参，不影响调用方的变量。',
              '对象类型：复制的是**对象引用的副本**；形参与实参指向同一个对象。',
              '因此：在方法内 `形参 = new ...` **不会**改变调用方的引用；但通过形参修改对象字段，会反映到原对象。',
              '把 Java 说成“按引用传参”是常见错误。准确表述是：**对象引用也是按值传递的**。',
            ],
            table: {
              headers: ['说法', '是否正确', '原因'],
              rows: [
                ['Java 是值传递', '正确', '实参的值被复制给形参'],
                ['对象参数按引用传参', '错误', '引用本身也是按值复制的'],
                ['对象参数可以修改原对象', '正确', '形参与实参指向同一对象'],
                ['重新赋值形参能改变实参', '错误', '只改了形参这个局部副本'],
              ],
            },
          },
        },
        {
          id: 'c1l4-s3',
          type: 'concept',
          content: {
            title: '与 C 指针的区别',
            paragraphs: [
              'Java 的引用不是指针：不能做算术运算，不能 `*ref` 解引用，不能指向任意内存地址。',
              'C 的指针可以 `p++`、`*(p+1)`；Java 的引用只能访问对象的字段与方法。',
              'Java 引用可以为 null，对 null 调用方法会抛 `NullPointerException`；C 的空指针解引用是未定义行为。',
              'C 传指针时，函数内可以通过 `*p = ...` 修改调用方指向的值；Java 传入引用副本，同样能修改对象内容，但不能让调用方的引用改指向。',
            ],
            table: {
              headers: ['行为', 'Java', 'C', 'Go'],
              rows: [
                ['传递方式', '值传递（引用按值复制）', '值传递；可显式传指针', '值传递；可显式传指针'],
                ['能否修改原对象', '能（通过引用副本）', '能（通过指针）', '能（通过指针或引用类型）'],
                ['能否改变调用方引用', '不能', '可以（传指针的指针）', '可以（传 **T）'],
                ['指针算术', '不支持', '支持', '不支持（unsafe 除外）'],
              ],
            },
          },
        },
        {
          id: 'c1l4-s4',
          type: 'example',
          content: {
            intro: '两个场景分别证明“改引用无效”和“改对象有效”。',
            scenarios: [
              {
                name: '场景 1：重新赋值形参，不影响实参',
                code: `public class PassByValue {
    static void reassign(int number) {
        number = 100;
    }

    static void reassign(StringBuilder builder) {
        builder = new StringBuilder("新对象");
    }

    public static void main(String[] args) {
        int value = 1;
        reassign(value);
        System.out.println(value);

        StringBuilder text = new StringBuilder("原对象");
        reassign(text);
        System.out.println(text);
    }
}`,
                output: '1\n原对象',
                lineNotes: {
                  2: '`reassign(int number)`：`number` 是 `value` 的副本。',
                  3: '修改 `number` 只改副本，调用方的 `value` 不变。',
                  6: '`reassign(StringBuilder builder)`：`builder` 是引用的副本；这里让它指向新对象。',
                  7: '只改了局部引用 `builder`，调用方的 `text` 仍指向原对象。',
                  11: '`value = 1`。',
                  12: '传入 1 的副本。',
                  13: '输出 1。',
                  15: '`text` 指向内容为“原对象”的 StringBuilder。',
                  16: '传入引用的副本。',
                  17: '输出“原对象”，不是“新对象”。',
                },
                takeaway:
                  '**一般规则**：重新赋值形参只改变局部副本；无论基本类型还是对象引用，都不能借此改变调用方的变量。',
              },
              {
                name: '场景 2：通过引用副本修改对象内容',
                code: `public class MutateObject {
    static void appendSuffix(StringBuilder builder) {
        builder.append("，已处理");
    }

    public static void main(String[] args) {
        StringBuilder text = new StringBuilder("订单");
        appendSuffix(text);
        System.out.println(text);
    }
}`,
                output: '订单，已处理',
                lineNotes: {
                  2: '`appendSuffix(StringBuilder builder)`：`builder` 是 `text` 引用的副本。',
                  3: '`builder.append` 修改的是同一个 StringBuilder 对象的内容。',
                  7: '创建可变字符串对象。',
                  8: '传入引用副本。',
                  9: '输出被修改后的内容。',
                },
                takeaway:
                  '**一般规则**：对象引用按值传递；方法内通过引用副本修改对象状态，调用方能看到变化，因为指向同一个对象。',
              },
            ],
          },
        },
        {
          id: 'c1l4-s5',
          type: 'quiz',
          content: {
            kind: 'judge',
            statement: 'Java 中对象参数传递的是引用本身，所以方法内重新赋值形参可以改变调用方的引用。',
            answer: false,
            explanation:
              'Java 只有值传递。对象参数传入的是引用的副本；重新赋值形参只改变副本，不会改变调用方引用。修改对象内容才会影响调用方。',
          },
        },
        {
          id: 'c1l4-s6',
          type: 'coding',
          content: {
            exerciseId: 'c1l4-swap',
            task: '实现 `static void swap(int[] arr)`：交换数组前两个元素。若长度小于 2 则不做任何事。在 main 中读入一行整数，调用 swap 后输出数组内容。',
            io: `输入：一行整数，以空白分隔
输出：交换前两个元素后的数组，用空格分隔
样例：输入 "1 2 3" → 输出 "2 1 3"
约束：长度小于 2 时原样输出。`,
            skeleton: `import java.util.Scanner;

public class Main {
    static void swap(int[] arr) {
        // 交换 arr[0] 与 arr[1]
    }

    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);
        String line = scanner.nextLine().trim();
        // 解析、调用 swap、输出
    }
}`,
            hints: [
              '数组是对象，`swap` 收到的是引用的副本，但指向同一个数组；修改元素会影响调用方。',
              '先检查 `arr.length >= 2`；用临时变量交换 `arr[0]` 与 `arr[1]`。',
              '关键 API：`arr.length`、临时变量、`System.out.print` / `println`。',
            ],
            tests: [
              {
                label: '三个元素',
                kind: 'normal',
                stdin: '1 2 3\n',
                expectedStdout: '2 1 3\n',
              },
              {
                label: '只有一个元素',
                kind: 'edge',
                stdin: '7\n',
                expectedStdout: '7\n',
              },
              {
                label: '两个相等元素',
                kind: 'tricky',
                stdin: '4 4\n',
                expectedStdout: '4 4\n',
              },
            ],
            answer: `import java.util.Scanner;

public class Main {
    static void swap(int[] arr) {
        if (arr.length < 2) {
            return;
        }
        int temp = arr[0];
        arr[0] = arr[1];
        arr[1] = temp;
    }

    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);
        String line = scanner.nextLine().trim();
        String[] parts = line.split("\\\\s+");
        int[] numbers = new int[parts.length];
        for (int i = 0; i < parts.length; i++) {
            numbers[i] = Integer.parseInt(parts[i]);
        }
        swap(numbers);
        for (int i = 0; i < numbers.length; i++) {
            if (i > 0) System.out.print(" ");
            System.out.print(numbers[i]);
        }
        System.out.println();
    }
}`,
            answerWhy:
              '`swap` 不能通过重新赋值形参来交换，因为那只是换掉局部引用；必须修改数组元素。输出时空格放在元素之间，避免末尾多一个空格。',
          },
        },
        {
          id: 'c1l4-s7',
          type: 'summary',
          content: {
            points: [
              {
                kind: 'general',
                text: '**一般规则**：Java 只有值传递；基本类型复制值，对象类型复制引用。',
              },
              {
                kind: 'general',
                text: '**一般规则**：方法内重新赋值形参不会影响调用方；修改对象内容会影响调用方。',
              },
              {
                kind: 'general',
                text: '**一般规则**：对象引用不是 C 指针，不能做指针算术，也不能解引用任意地址。',
              },
              {
                kind: 'scenario',
                text: '重新赋值示例与 append 示例分别对应“改引用无效”和“改对象有效”，这是判断参数传递问题的通用方法。',
              },
            ],
          },
        },
        {
          id: 'c1l4-s8',
          type: 'pitfall',
          content: {
            items: [
              {
                wrong: 'static void swap(int a, int b) { int t = a; a = b; b = t; }',
                why: '交换的是两个副本，调用方变量不变；Java 无法通过这种方式交换基本类型实参。',
                right: '交换数组元素，或把值封装进对象 / 返回新值。',
              },
              {
                wrong: '认为 StringBuilder 是可变的，所以重新赋值也能改变调用方',
                why: '可变的是对象内容，不是引用；`builder = new ...` 只改局部引用副本。',
                right: '调用 `builder.append(...)` 修改同一对象。',
              },
              {
                wrong: '说“Java 对对象是引用传递”',
                why: '引用本身也是按值复制的；准确说法是“对象引用按值传递”。',
                right: 'Java 只有值传递；对象参数传递的是引用的副本。',
              },
            ],
          },
        },
      ],
    },
  ],
}
