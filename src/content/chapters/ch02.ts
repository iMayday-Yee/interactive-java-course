import type { Chapter } from '../../types/content'

export const chapter02: Chapter = {
  id: 'chapter-2',
  number: 2,
  title: 'String 与包装类',
  subtitle: '字符串不可变、== 与 equals、拼接方式、装箱缓存，都是写 Java 每天都会踩到的地方。',
  lessons: [
    {
      id: 'c2l1',
      chapter: 2,
      title: 'String 不可变性与常用操作',
      summary: 'String 是引用类型且不可变；所有“修改”方法都返回新字符串，内容比较必须用 equals。',
      steps: [
        {
          id: 'c2l1-s1',
          type: 'goal',
          content: {
            text: '你能解释 String 为什么不可变，正确使用 trim / substring / indexOf 等常用方法，并知道 length 数的是什么。',
            checklist: ['区分“返回新字符串”和“修改原字符串”', '知道 substring 的区间是左闭右开', '知道 length 数的是 UTF-16 码元'],
          },
        },
        {
          id: 'c2l1-s2',
          type: 'concept',
          content: {
            title: 'String 是不可变对象',
            paragraphs: [
              '`String` 是引用类型，不是基本类型；变量保存的是指向字符串对象的引用。',
              '**不可变**：对象一旦创建，内容就不能改变。`toUpperCase()`、`trim()`、`substring()` 都不会修改原对象，而是返回一个新字符串。',
              '不可变带来两个直接好处：字符串可以安全共享；作为 `HashMap` 的 key 时，内容不会在放入后变化。代价是频繁拼接会产生大量临时对象。',
              '`length()` 返回的是 UTF-16 码元数量，不是 Unicode 码点数量。常见汉字通常占 1 个码元，增补字符占 2 个。',
              '与 Go 的 `string` 一样，Java 的 `String` 也不可变；但 Go 的字符串以 UTF-8 字节存储，Java 的 `char` / `length` 以 UTF-16 码元为口径。',
            ],
            table: {
              headers: ['写法', '返回', '原字符串是否改变'],
              rows: [
                ['`s.toUpperCase()`', '新字符串', '否'],
                ['`s.trim()`', '去掉首尾空白的新字符串', '否'],
                ['`s.substring(1, 3)`', '下标 1、2 组成的新字符串', '否'],
                ['`s + "!"`', '新字符串', '否'],
                ['`s.length()`', 'UTF-16 码元数量', '不适用（只读）'],
              ],
            },
            note: '判断“改没改”只看一件事：方法有没有返回新值。忽略返回值，就等于没调用。',
          },
        },
        {
          id: 'c2l1-s3',
          type: 'example',
          content: {
            scenarios: [
              {
                name: '场景 1：用户名规范化',
                code: `import java.util.Scanner;

public class NormalizeName {
    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);
        String raw = scanner.nextLine();
        String name = raw.trim().toLowerCase();
        System.out.println(name + ":" + name.length());
    }
}`,
                output: 'alice:5',
                lineNotes: {
                  6: '`scanner.nextLine()` 读取一整行，包括行内空格。',
                  7: '`trim()` 返回去掉首尾空白的新字符串；`toLowerCase()` 再返回一个小写的新字符串。`raw` 本身没有改变。',
                  8: '`name.length()` 是规范化之后的长度，不是原始输入的长度。',
                },
                takeaway: '**一般规则**：字符串处理方法返回新值；需要保留结果就赋值给变量，不要假设原对象被修改。',
              },
              {
                name: '场景 2：从日志行截取字段',
                code: `public class LogField {
    public static void main(String[] args) {
        String log = "2026-11-09 ERROR disk full";
        int firstSpace = log.indexOf(' ');
        int secondSpace = log.indexOf(' ', firstSpace + 1);
        String date = log.substring(0, firstSpace);
        String level = log.substring(firstSpace + 1, secondSpace);
        System.out.println(date + " / " + level);
    }
}`,
                output: '2026-11-09 / ERROR',
                lineNotes: {
                  3: '日志行是一个普通字符串；日期、级别、消息都在里面。',
                  4: '`indexOf(\' \')` 返回第一个空格的下标；找不到时返回 -1。',
                  5: '从第一个空格之后继续找第二个空格。',
                  6: '`substring(0, firstSpace)` 取下标 0 到 firstSpace-1，**不包含** firstSpace。',
                  7: '`substring(firstSpace + 1, secondSpace)` 跳过空格，取到第二个空格之前。',
                  8: '拼接日期与级别；两个 substring 都返回新字符串。',
                },
                takeaway: '**一般规则**：`substring(begin, end)` 是左闭右开区间；先用 `indexOf` 找到边界，再截取。',
              },
            ],
          },
        },
        {
          id: 'c2l1-s4',
          type: 'quiz',
          content: {
            kind: 'judge',
            statement: '执行 `String s = "abc"; s.toUpperCase();` 之后，`s` 的内容变成 `"ABC"`。',
            answer: false,
            explanation: '`toUpperCase()` 返回新字符串，不会修改原对象。要得到大写结果必须写成 `s = s.toUpperCase();`。',
          },
        },
        {
          id: 'c2l1-s5',
          type: 'coding',
          content: {
            exerciseId: 'c2l1-normalize',
            task: '读入一行用户名，去掉首尾空白并转成小写，输出 `规范名:长度`。',
            io: `输入：一行文本（可能带首尾空格）
输出：规范化后的名字 + ":" + 字符数
样例：输入 "  Alice  " → 输出 alice:5
约束：只处理单行；名字可以为空。`,
            skeleton: `import java.util.Scanner;

public class Main {
    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);
        // 读取一行，规范化并输出 name:length
    }
}`,
            hints: [
              '概念回顾：`trim()` 和 `toLowerCase()` 都返回新字符串，不会改变原变量。',
              '解题方向：先读一行，再依次做去空白、转小写，最后拼接输出。',
              '关键 API：`String.trim`、`String.toLowerCase`、`String.length`。',
            ],
            tests: [
              {
                label: '首尾带空格',
                kind: 'normal',
                stdin: '  Alice  \n',
                expectedStdout: 'alice:5\n',
              },
              {
                label: '本来就是规范形式',
                kind: 'edge',
                stdin: 'BOB\n',
                expectedStdout: 'bob:3\n',
              },
              {
                label: '空行',
                kind: 'tricky',
                stdin: '\n',
                expectedStdout: ':0\n',
              },
            ],
            answer: `import java.util.Scanner;

public class Main {
    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);
        String name = scanner.nextLine().trim().toLowerCase();
        System.out.println(name + ":" + name.length());
    }
}`,
            answerWhy:
              '`trim()` 先去掉首尾空白，`toLowerCase()` 再返回小写的新字符串。长度必须对规范化后的 `name` 调用，不能对原始输入调用。',
          },
        },
        {
          id: 'c2l1-s6',
          type: 'summary',
          content: {
            points: [
              {
                kind: 'general',
                text: '**一般规则**：`String` 不可变；所有看似修改的方法都返回新对象，结果必须接收。',
              },
              {
                kind: 'general',
                text: '**一般规则**：`substring(begin, end)` 左闭右开；越界会抛 `StringIndexOutOfBoundsException`。',
              },
              {
                kind: 'general',
                text: '**一般规则**：`length()` 返回 UTF-16 码元数；需要 Unicode 码点数量时用 `codePointCount`。',
              },
              {
                kind: 'scenario',
                text: '用户名规范化演示了链式返回新字符串；日志截取演示了先找边界再 substring。',
              },
            ],
          },
        },
        {
          id: 'c2l1-s7',
          type: 'pitfall',
          content: {
            items: [
              {
                wrong: 'String s = "abc";\ns.toUpperCase();\nSystem.out.println(s);',
                why: '没有接收返回值，原字符串仍是大写转换前的内容。',
                right: 's = s.toUpperCase();',
              },
              {
                wrong: 'String name = "admin";\nif (name == "admin") { ... }',
                why: '`==` 比较引用身份，不是内容；运行时拼接出来的字符串很容易与常量不是同一个对象。',
                right: 'if ("admin".equals(name)) { ... }',
              },
              {
                wrong: 'String s = "abc";\nSystem.out.println(s.substring(1, 9));',
                why: 'end 超出长度会抛 `StringIndexOutOfBoundsException`；end 最大只能是 `length()`。',
                right: '先判断长度，或使用 `Math.min(end, s.length())`。',
              },
            ],
          },
        },
      ],
    },
    {
      id: 'c2l2',
      chapter: 2,
      title: '== 与 equals：常量池与 intern',
      summary: '== 对引用比较身份，equals 比较内容；字符串常量池让字面量可能共享对象，但不能依赖 == 比较内容。',
      steps: [
        {
          id: 'c2l2-s1',
          type: 'goal',
          content: {
            text: '你能解释字符串常量池、new String 与 intern 的差异，并在任何场景下选择正确的字符串比较方式。',
            checklist: ['知道 == 与 equals 各自比较什么', '知道 new String 不进入常量池', '会用 Objects.equals 处理 null'],
          },
        },
        {
          id: 'c2l2-s2',
          type: 'concept',
          content: {
            title: '身份比较与内容比较',
            paragraphs: [
              '`==` 对基本类型比较值；对引用类型比较**是否指向同一个对象**。',
              '`equals` 是方法，`String.equals` 比较内容。字符串内容比较必须用 `equals`，需要忽略大小写时用 `equalsIgnoreCase`。',
              '**字符串常量池**：直接写出的字面量 `"admin"` 会进入常量池；相同字面量通常复用同一个对象。',
              '`new String("admin")` 一定创建一个新对象，不直接复用池中的实例；`intern()` 会返回池中与内容相同的实例。',
              '与 Go / Python 不同：Go 的 `==` 和 Python 的 `==` 比较字符串内容；Java 的 `==` 比较引用身份。',
            ],
            table: {
              headers: ['语言', '字符串内容比较', '身份比较'],
              rows: [
                ['Java', '`a.equals(b)`', '`a == b`'],
                ['Go', '`a == b`', '没有直接等价语法'],
                ['Python', '`a == b`', '`a is b`'],
              ],
            },
            note: '不要用 `==` 比较字符串内容；它偶尔为 true，只会让问题更隐蔽。',
          },
        },
        {
          id: 'c2l2-s3',
          type: 'example',
          content: {
            scenarios: [
              {
                name: '场景 1：登录名比较',
                code: `public class LoginCheck {
    public static void main(String[] args) {
        String stored = "admin";
        String input = new String("admin");
        System.out.println(input == stored);
        System.out.println(input.equals(stored));
    }
}`,
                output: 'false\ntrue',
                lineNotes: {
                  3: '字面量 `"admin"` 进入常量池，`stored` 指向池中的对象。',
                  4: '`new String(...)` 显式创建一个新对象，即使内容与池中相同。',
                  5: '`==` 比较引用身份，两个变量指向不同对象，结果是 false。',
                  6: '`equals` 比较内容，字符序列相同，结果是 true。',
                },
                takeaway: '**一般规则**：比较字符串内容用 `equals`；`==` 只在需要判断“是不是同一个对象”时使用。',
              },
              {
                name: '场景 2：缓存 key 用内容匹配',
                code: `import java.util.HashMap;
import java.util.Map;

public class CouponCache {
    public static void main(String[] args) {
        Map<String, String> cache = new HashMap<>();
        cache.put("WELCOME", "10 元券");
        String key = new String("WELCOME");
        System.out.println(key == "WELCOME");
        System.out.println(cache.get(key));
    }
}`,
                output: 'false\n10 元券',
                lineNotes: {
                  6: '用一个 `Map` 模拟缓存：key 是字符串，value 是券的说明。',
                  7: '`put` 时，`HashMap` 用 `hashCode` 定位桶，再用 `equals` 比较 key 的内容。',
                  8: '这里故意用 `new String` 造一个不同对象，但内容相同。',
                  9: '引用身份不同，`==` 为 false。',
                  10: '`get` 仍能命中，因为 `HashMap` 用 `equals` 比较 key，而不是用 `==`。',
                },
                takeaway: '**一般规则**：依赖内容匹配的容器（如 HashMap、HashSet）使用 `equals` / `hashCode`；传一个内容相同的新字符串也能命中。',
              },
            ],
          },
        },
        {
          id: 'c2l2-s4',
          type: 'quiz',
          content: {
            kind: 'choice',
            question: '下面哪一句是可靠的字符串内容比较？',
            options: [
              '`a == b`',
              '`a.equals(b)`',
              '`a.hashCode() == b.hashCode()`',
              '`a.toString() == b.toString()`',
            ],
            answerIndex: 1,
            explanation:
              '`equals` 比较内容。`==` 比较身份；hashCode 相同不代表内容相同（哈希冲突）；toString 默认返回身份相关文本，仍不是内容比较。',
          },
        },
        {
          id: 'c2l2-s5',
          type: 'coding',
          content: {
            exerciseId: 'c2l2-samename',
            task: '读入两行名字，忽略大小写判断它们是否相同，输出 `same` 或 `different`。',
            io: `输入：两行文本
输出：same 或 different
样例：输入 "Alice" 和 "alice" → 输出 same
约束：只比较内容，忽略大小写；不要去掉空白。`,
            skeleton: `import java.util.Scanner;

public class Main {
    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);
        String first = scanner.nextLine();
        String second = scanner.nextLine();
        // 比较两个名字
    }
}`,
            hints: [
              '概念回顾：`==` 比较引用身份，`equals` 比较内容。',
              '解题方向：需要一个忽略大小写的内容比较。',
              '关键 API：`String.equalsIgnoreCase`。',
            ],
            tests: [
              {
                label: '只有大小写不同',
                kind: 'normal',
                stdin: 'Alice\nalice\n',
                expectedStdout: 'same\n',
              },
              {
                label: '两行都为空',
                kind: 'edge',
                stdin: '\n\n',
                expectedStdout: 'same\n',
              },
              {
                label: '内容不同',
                kind: 'tricky',
                stdin: 'A\nB\n',
                expectedStdout: 'different\n',
              },
            ],
            answer: `import java.util.Scanner;

public class Main {
    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);
        String first = scanner.nextLine();
        String second = scanner.nextLine();
        System.out.println(first.equalsIgnoreCase(second) ? "same" : "different");
    }
}`,
            answerWhy:
              '`equalsIgnoreCase` 同时解决两个问题：比较内容而不是引用，并且忽略大小写。若用 `==`，即使内容相同也可能输出 different。',
          },
        },
        {
          id: 'c2l2-s6',
          type: 'summary',
          content: {
            points: [
              {
                kind: 'general',
                text: '**一般规则**：引用类型的 `==` 比较身份；需要内容相等时调用该类型的 `equals`。',
              },
              {
                kind: 'general',
                text: '**一般规则**：字面量可能来自常量池，`new String` 一定创建新对象；不要根据 `==` 的结果推断内容是否相等。',
              },
              {
                kind: 'general',
                text: '**一般规则**：可能为 null 的字符串比较，把常量放在前面（`"x".equals(s)`）或使用 `Objects.equals`。',
              },
              {
                kind: 'scenario',
                text: '登录名比较暴露了引用身份差异；HashMap 取缓存说明容器按内容匹配 key。',
              },
            ],
          },
        },
        {
          id: 'c2l2-s7',
          type: 'pitfall',
          content: {
            items: [
              {
                wrong: 'String a = new String("java");\nString b = "java";\nif (a == b) { ... }',
                why: '`new String` 创建了新对象，`==` 比较身份，结果为 false。',
                right: 'if (a.equals(b)) { ... }',
              },
              {
                wrong: 'String input = null;\nif (input.equals("yes")) { ... }',
                why: '对 null 调用实例方法会抛 `NullPointerException`。',
                right: 'if ("yes".equals(input)) { ... } 或 Objects.equals(input, "yes")',
              },
              {
                wrong: 'if (a.hashCode() == b.hashCode()) { /* 认为内容相同 */ }',
                why: '哈希冲突允许不同内容得到同一个 hashCode；hashCode 只能缩小查找范围。',
                right: '再用 `equals` 确认内容。',
              },
            ],
          },
        },
      ],
    },
    {
      id: 'c2l3',
      chapter: 2,
      title: 'StringBuilder 与 StringBuffer',
      summary: '频繁拼接用 StringBuilder；需要线程安全才用 StringBuffer。两者都是可变字符序列。',
      steps: [
        {
          id: 'c2l3-s1',
          type: 'goal',
          content: {
            text: '你能解释 String 拼接的成本，使用 StringBuilder 构建长文本，并在需要线程安全时做出正确选择。',
            checklist: ['知道 += 在循环里会创建大量临时对象', '会用 append / insert / delete', '知道 StringBuffer 的同步代价'],
          },
        },
        {
          id: 'c2l3-s2',
          type: 'concept',
          content: {
            title: '可变字符序列',
            paragraphs: [
              '`String` 不可变，循环里 `s += i` 每次都会创建新字符串，并把旧内容复制过去；次数多时开销明显。',
              '`StringBuilder` 是可变的字符序列：`append`、`insert`、`delete`、`reverse` 直接修改内部缓冲区，最后用 `toString()` 得到字符串。',
              '`StringBuilder` 不是线程安全的；多个线程共享同一个实例时，需要外部同步。',
              '`StringBuffer` 的方法用 `synchronized` 保证线程安全，代价是单线程下更慢。没有共享需求时优先 `StringBuilder`。',
              'Go 可用 `strings.Builder`，Python 常用 `"".join(parts)`；三者的共同点是避免在循环里反复复制整个字符串。',
            ],
            table: {
              headers: ['类型', '可变', '线程安全', '典型用途'],
              rows: [
                ['`String`', '否', '不可变所以可共享', '普通文本、Map key'],
                ['`StringBuilder`', '是', '否', '单线程循环拼接'],
                ['`StringBuffer`', '是', '是（方法同步）', '多线程共享缓冲'],
              ],
            },
            note: '`StringBuilder` 的容量会自动扩展，但预估长度可以写成 `new StringBuilder(1024)` 减少扩容。',
          },
        },
        {
          id: 'c2l3-s3',
          type: 'example',
          content: {
            scenarios: [
              {
                name: '场景 1：用逗号连接数字',
                code: `public class JoinNumbers {
    public static void main(String[] args) {
        StringBuilder builder = new StringBuilder();
        for (int i = 1; i <= 5; i++) {
            if (i > 1) {
                builder.append(',');
            }
            builder.append(i);
        }
        System.out.println(builder.toString());
    }
}`,
                output: '1,2,3,4,5',
                lineNotes: {
                  3: '创建一个可变的 StringBuilder，初始为空。',
                  4: '循环 5 次；每次 append 都修改同一个缓冲区。',
                  5: '从第二个数字开始先加逗号，避免末尾多一个逗号。',
                  8: '`append(int)` 把数字转成文本追加进去。',
                  10: '`toString()` 生成最终字符串，只在这里创建一次 String。',
                },
                takeaway: '**一般规则**：循环内累积文本用 StringBuilder 的 append，最后统一 toString，避免每轮创建新字符串。',
              },
              {
                name: '场景 2：拼接一段 JSON 片段',
                code: `public class JsonFragment {
    public static void main(String[] args) {
        StringBuilder json = new StringBuilder();
        json.append('{');
        json.append("\\"name\\":\\"").append("Ada").append("\\",");
        json.append("\\"age\\":").append(36);
        json.append('}');
        System.out.println(json);
    }
}`,
                output: '{"name":"Ada","age":36}',
                lineNotes: {
                  3: 'JSON 是文本，适合用 StringBuilder 逐段构建。',
                  4: 'append 可以接收 char；这里加入左花括号。',
                  5: '连续 append 形成 name 字段；注意引号需要转义。',
                  6: '数字 36 通过 append(int) 自动转成文本，不需要手动 String.valueOf。',
                  7: '闭合对象。',
                  8: 'println 会调用 StringBuilder 的 toString()。',
                },
                takeaway: '**一般规则**：append 有多个重载，基本类型、char、String 都能直接追加；链式 append 可读性更好。',
              },
            ],
          },
        },
        {
          id: 'c2l3-s4',
          type: 'quiz',
          content: {
            kind: 'choice',
            question: '在单线程方法里循环拼接 10 万次，应该优先选哪个？',
            options: ['`String` + `+=`', '`StringBuilder`', '`StringBuffer`', '每次都 `new String`'],
            answerIndex: 1,
            explanation:
              '单线程用 StringBuilder 最快。String 的 += 会产生大量临时对象；StringBuffer 有同步开销，只有共享实例时才需要。',
          },
        },
        {
          id: 'c2l3-s5',
          type: 'coding',
          content: {
            exerciseId: 'c2l3-join',
            task: '读入一个整数 n（n ≥ 1），输出 1 到 n，用逗号连接，末尾不能多出逗号。',
            io: `输入：一个整数 n
输出：1,2,...,n
样例：输入 5 → 输出 1,2,3,4,5
约束：n ≥ 1；用 StringBuilder 构建结果。`,
            skeleton: `import java.util.Scanner;

public class Main {
    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);
        int n = scanner.nextInt();
        // 用 StringBuilder 拼接 1..n
    }
}`,
            hints: [
              '概念回顾：循环里 `s += i` 每轮都会复制整个字符串。',
              '解题方向：用一个 StringBuilder，从 1 循环到 n；只有 i > 1 时先 append 逗号。',
              '关键 API：`StringBuilder.append`、`StringBuilder.toString`。',
            ],
            tests: [
              {
                label: '五个数字',
                kind: 'normal',
                stdin: '5\n',
                expectedStdout: '1,2,3,4,5\n',
              },
              {
                label: '只有一个数字',
                kind: 'edge',
                stdin: '1\n',
                expectedStdout: '1\n',
              },
              {
                label: '两位数边界',
                kind: 'tricky',
                stdin: '10\n',
                expectedStdout: '1,2,3,4,5,6,7,8,9,10\n',
              },
            ],
            answer: `import java.util.Scanner;

public class Main {
    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);
        int n = scanner.nextInt();
        StringBuilder builder = new StringBuilder();
        for (int i = 1; i <= n; i++) {
            if (i > 1) {
                builder.append(',');
            }
            builder.append(i);
        }
        System.out.println(builder.toString());
    }
}`,
            answerWhy:
              '只在 i > 1 时加逗号，末尾就不会多出分隔符。用 StringBuilder 避免每轮创建新字符串；最后一次性 toString 输出。',
          },
        },
        {
          id: 'c2l3-s6',
          type: 'summary',
          content: {
            points: [
              {
                kind: 'general',
                text: '**一般规则**：循环内累积文本用 StringBuilder；拼接次数少时直接用 + 更易读。',
              },
              {
                kind: 'general',
                text: '**一般规则**：多个线程共享同一个可变缓冲时用 StringBuffer，或给 StringBuilder 加外部同步。',
              },
              {
                kind: 'general',
                text: '**一般规则**：StringBuilder 不是 String；需要字符串时调用 `toString()`，println 会自动调用。',
              },
              {
                kind: 'scenario',
                text: '数字连接与 JSON 片段都遵循“分段 append、最后 toString”的模式。',
              },
            ],
          },
        },
        {
          id: 'c2l3-s7',
          type: 'pitfall',
          content: {
            items: [
              {
                wrong: 'String s = "";\nfor (int i = 0; i < 100000; i++) {\n    s += i;\n}',
                why: '每轮 += 都创建新字符串并复制旧内容，复杂度近似平方级。',
                right: '用 StringBuilder 在循环外创建，循环内 append。',
              },
              {
                wrong: '把同一个 StringBuilder 作为字段，被多个线程同时 append。',
                why: 'StringBuilder 没有同步，可能得到交错内容或内部状态错误。',
                right: '每个线程用自己的 StringBuilder，或改用 StringBuffer / 外部同步。',
              },
              {
                wrong: 'StringBuilder 的 `reverse()` 之后认为原字符串也反了。',
                why: 'StringBuilder 是可变的，reverse 会直接修改它；但由它 toString 出来的旧 String 不会变。',
                right: '明确区分 StringBuilder 本身和它生成过的 String 快照。',
              },
            ],
          },
        },
      ],
    },
    {
      id: 'c2l4',
      chapter: 2,
      title: '包装类、装箱拆箱与 Integer 缓存',
      summary: '基本类型有对应的包装类；自动装箱可能复用缓存对象，用 == 比较包装类值会出错。',
      steps: [
        {
          id: 'c2l4-s1',
          type: 'goal',
          content: {
            text: '你能解释自动装箱/拆箱，避开 Integer 缓存造成的 == 陷阱，并用 String.format 与文本块输出格式化文本。',
            checklist: ['知道 8 个包装类', '知道 Integer 缓存范围', '会用 formatted / String.format'],
          },
        },
        {
          id: 'c2l4-s2',
          type: 'concept',
          content: {
            title: '包装类与自动装箱',
            paragraphs: [
              '每种基本类型都有包装类：`Byte`、`Short`、`Integer`、`Long`、`Float`、`Double`、`Character`、`Boolean`。它们是引用类型，可以为 null。',
              '**自动装箱**：把基本类型赋给包装类变量时，编译器调用 `valueOf`；**自动拆箱**：把包装类赋给基本类型时，调用 `intValue` 等方法。',
              '`Integer.valueOf` 对 -128~127 的整数使用缓存，重复调用会返回同一个对象；超出范围才新建。因此 `==` 比较两个 Integer 的结果会随数值变化。',
              '包装类比较值必须用 `equals`，或者先拆箱成基本类型再比较。',
              '`String.format` 用格式符生成文本；Java 15 的文本块用三引号保留换行，配合 `formatted` 填入参数。',
            ],
            table: {
              headers: ['基本类型', '包装类', '解析方法'],
              rows: [
                ['`int`', '`Integer`', '`Integer.parseInt`'],
                ['`long`', '`Long`', '`Long.parseLong`'],
                ['`double`', '`Double`', '`Double.parseDouble`'],
                ['`boolean`', '`Boolean`', '`Boolean.parseBoolean`'],
                ['`char`', '`Character`', '无 parse；用字符本身'],
              ],
            },
            note: '对 null 的包装类做自动拆箱（如 `int x = integer;`）会抛 `NullPointerException`。',
          },
        },
        {
          id: 'c2l4-s3',
          type: 'example',
          content: {
            scenarios: [
              {
                name: '场景 1：Integer 缓存边界',
                code: `public class IntegerCache {
    public static void main(String[] args) {
        Integer a = 127;
        Integer b = 127;
        Integer c = 128;
        Integer d = 128;
        System.out.println(a == b);
        System.out.println(c == d);
        System.out.println(c.equals(d));
    }
}`,
                output: 'true\nfalse\ntrue',
                lineNotes: {
                  3: '127 在缓存范围内，自动装箱调用 `Integer.valueOf(127)`。',
                  4: '再次 valueOf(127)，返回缓存中的同一个对象。',
                  5: '128 超出缓存范围，valueOf 新建对象。',
                  6: '第二次 valueOf(128)，再新建一个对象。',
                  7: '`a == b` 为 true，因为指向同一个缓存对象。',
                  8: '`c == d` 为 false，因为两个不同对象。',
                  9: '`equals` 比较数值，所以 true。',
                },
                takeaway: '**一般规则**：包装类比较值用 `equals`；不要依赖 `==`，缓存范围只是实现细节。',
              },
              {
                name: '场景 2：格式化价格与文本块（Java 15+）',
                javaVersion: 'Java 15',
                code: `public class PriceReport {
    public static void main(String[] args) {
        String item = "Java 教材";
        double price = 19.9;
        String report = """
                商品：%s
                金额：%.2f 元
                """.formatted(item, price);
        System.out.print(report);
    }
}`,
                output: '商品：Java 教材\n金额：19.90 元',
                lineNotes: {
                  3: '商品名是普通字符串。',
                  4: '价格用 double；格式化时再控制小数位。',
                  5: '三引号开始文本块，换行会被保留。',
                  6: '`%s` 接收字符串参数。',
                  7: '`%.2f` 保留两位小数；`formatted` 依次填入 item、price。',
                  8: '文本块结束；缩进会按最小公共缩进剥离。',
                  9: '`print` 不额外添加换行，文本块自身已带一个换行。',
                },
                takeaway: '**一般规则**：展示金额用格式符控制小数位；多行模板用文本块 + formatted，比手动拼接更清楚。',
              },
            ],
          },
        },
        {
          id: 'c2l4-s4',
          type: 'quiz',
          content: {
            kind: 'choice',
            question: '`Integer a = 128; Integer b = 128;` 时，`a == b` 的结果是？',
            options: ['true', 'false', '编译错误', '取决于 JVM 版本'],
            answerIndex: 1,
            explanation:
              '128 超出 Integer 缓存范围（-128~127），两次自动装箱会创建两个不同对象，`==` 比较身份为 false。用 `a.equals(b)` 才是 true。',
          },
        },
        {
          id: 'c2l4-s5',
          type: 'coding',
          content: {
            exerciseId: 'c2l4-intcompare',
            task: '读入两行整数，判断数值是否相等，输出 `equal` 或 `different`。必须用包装类的值比较，不能依赖 ==。',
            io: `输入：两行整数
输出：equal 或 different
样例：输入 128 和 128 → 输出 equal
约束：整数在 int 范围内；用 Integer 包装类比较。`,
            skeleton: `import java.util.Scanner;

public class Main {
    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);
        Integer first = Integer.valueOf(scanner.nextLine().trim());
        Integer second = Integer.valueOf(scanner.nextLine().trim());
        // 比较两个 Integer 的数值
    }
}`,
            hints: [
              '概念回顾：Integer 缓存只覆盖 -128~127，`==` 比较的是对象身份。',
              '解题方向：用 `equals` 比较两个包装类；也可以先拆箱再用基本类型 ==。',
              '关键 API：`Integer.equals`。',
            ],
            tests: [
              {
                label: '缓存范围内的相同值',
                kind: 'normal',
                stdin: '127\n127\n',
                expectedStdout: 'equal\n',
              },
              {
                label: '缓存范围外的相同值',
                kind: 'edge',
                stdin: '128\n128\n',
                expectedStdout: 'equal\n',
              },
              {
                label: '负数超出缓存',
                kind: 'tricky',
                stdin: '-129\n-129\n',
                expectedStdout: 'equal\n',
              },
              {
                label: '不同值',
                kind: 'normal',
                stdin: '1\n2\n',
                expectedStdout: 'different\n',
              },
            ],
            answer: `import java.util.Scanner;

public class Main {
    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);
        Integer first = Integer.valueOf(scanner.nextLine().trim());
        Integer second = Integer.valueOf(scanner.nextLine().trim());
        System.out.println(first.equals(second) ? "equal" : "different");
    }
}`,
            answerWhy:
              '`equals` 比较包装类承载的数值，不受缓存范围影响。如果用 `first == second`，127 的用例会通过，128 的用例会失败，这正是本题要暴露的陷阱。',
          },
        },
        {
          id: 'c2l4-s6',
          type: 'summary',
          content: {
            points: [
              {
                kind: 'general',
                text: '**一般规则**：基本类型与包装类之间会自动装箱/拆箱；包装类可以为 null，拆箱前要先判空。',
              },
              {
                kind: 'general',
                text: '**一般规则**：包装类比较值用 `equals` 或先拆箱；`==` 比较对象身份，结果可能随缓存实现变化。',
              },
              {
                kind: 'general',
                text: '**一般规则**：解析文本用 `parseXxx`；格式化输出用 `String.format` 或文本块的 `formatted`。',
              },
              {
                kind: 'scenario',
                text: '整数缓存示例展示了 127 与 128 的差异；价格报告展示了格式符与文本块。',
              },
            ],
          },
        },
        {
          id: 'c2l4-s7',
          type: 'pitfall',
          content: {
            items: [
              {
                wrong: 'Integer a = 1000;\nInteger b = 1000;\nif (a == b) { ... }',
                why: '1000 超出缓存范围，两个对象身份不同，== 为 false。',
                right: 'if (a.equals(b)) { ... }',
              },
              {
                wrong: 'Integer count = null;\nint n = count;',
                why: '自动拆箱会对 null 调用 intValue，抛 NullPointerException。',
                right: '先判断 `count != null`，或给默认值。',
              },
              {
                wrong: 'double total = 0.1 + 0.2;\nif (total == 0.3) { ... }',
                why: '二进制浮点无法精确表示 0.1/0.2，求和结果与 0.3 不相等。金额应使用整数分或 BigDecimal。',
                right: '用 `Math.abs(total - 0.3) < 1e-9` 比较，金额用 long 分或 BigDecimal。',
              },
            ],
          },
        },
      ],
    },
  ],
}
