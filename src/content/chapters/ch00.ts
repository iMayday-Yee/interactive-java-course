import type { Chapter } from '../../types/content'

export const chapter00: Chapter = {
  id: 'chapter-0',
  number: 0,
  title: 'Java 运行机制',
  subtitle: '先弄清楚代码是怎么跑起来的，再开始写。',
  lessons: [
    {
      id: 'c0l1',
      chapter: 0,
      title: '从 .java 到 .class，再交给 JVM',
      summary: 'javac 把源码编译成字节码，JVM 负责加载并执行。',
      steps: [
        {
          id: 'c0l1-s1',
          type: 'goal',
          content: {
            text: '你能说清楚一个 `.java` 文件从磁盘到运行经过哪些步骤，以及每一步产出了什么。',
            checklist: [
              '区分编译期与运行期',
              '知道 `.class` 里是字节码，不是机器码',
              '能解释为什么 Java 需要 JVM',
            ],
          },
        },
        {
          id: 'c0l1-s2',
          type: 'concept',
          content: {
            title: '编译与运行的四个阶段',
            paragraphs: [
              '源文件 `Hello.java` 先由 `javac` 编译成 `Hello.class`。`.class` 里不是机器码，而是 **JVM 字节码**（bytecode）。',
              '运行时，JVM 的类加载器把 `.class` 读入内存，解释器或 JIT 编译器再把字节码变成当前平台能执行的指令。',
              '所以同一份 `.class` 可以在不同操作系统、不同 CPU 上运行，前提是对应的 JVM 存在。',
            ],
            table: {
              headers: ['阶段', '命令 / 角色', '产物'],
              rows: [
                ['写源码', '编辑器', '`Hello.java`'],
                ['编译', '`javac`', '`Hello.class`（字节码）'],
                ['加载', 'JVM 类加载器', '内存中的类'],
                ['执行', '解释器 / JIT', '当前平台的机器指令'],
              ],
            },
            note: '`javac` 是编译器，不是 JVM 的一部分；`java` 命令负责启动 JVM 并指定要运行的类。',
          },
        },
        {
          id: 'c0l1-s3',
          type: 'concept',
          content: {
            title: '和 Go 的关键区别',
            paragraphs: [
              'Go 的 `go build` 默认产出**原生可执行文件**，运行时不需要 Go 工具链；Java 的 `javac` 产出字节码，运行时需要 JVM。',
              '这不代表 Java 慢：JVM 会在运行中把热点字节码编译成本地机器码（JIT）。区别在于**编译发生在什么时候、产物依赖什么**。',
              'Python 通常由解释器直接执行 `.py` 源码，没有显式的独立编译步骤；Java 多了 `javac` 这一步。',
            ],
            table: {
              headers: ['问题', 'Java', 'Go', 'Python'],
              rows: [
                ['编译产物', '`.class` 字节码', '原生可执行文件', '通常无独立产物'],
                ['运行时依赖', 'JVM', '几乎无（静态链接时）', '解释器'],
                ['跨平台方式', '同一字节码 + 不同 JVM', '按目标平台分别编译', '同一源码 + 不同解释器'],
                ['编译命令', '`javac Hello.java`', '`go build`', '通常无'],
              ],
            },
          },
        },
        {
          id: 'c0l1-s4',
          type: 'example',
          content: {
            intro: '同一个概念用两个场景看：独立入口程序，以及一个类调用另一个类。',
            scenarios: [
              {
                name: '场景 1：最小可运行程序',
                code: `public class Hello {
    public static void main(String[] args) {
        System.out.println("Hello, Java");
    }
}`,
                output: 'Hello, Java',
                lineNotes: {
                  1: '`public class Hello`：声明一个公开类。文件名必须是 `Hello.java`，public 类名与文件名一致。',
                  2: '`public static void main`：JVM 启动后寻找的入口方法。四个部分各有职责，下一节展开。',
                  3: '`System.out.println`：向标准输出打印一行。`println` 会在末尾追加换行。',
                  4: '第一个 `}` 结束 `main`，第二个 `}` 结束 `Hello` 类。',
                },
                takeaway:
                  '**一般形式**：一个可运行的 Java 程序至少包含一个类，类中有一个 `public static void main(String[] args)` 方法。',
              },
              {
                name: '场景 2：两个类协作（仍在同一个文件）',
                code: `class Greeter {
    void greet(String name) {
        System.out.println("Hello, " + name);
    }
}

public class Main {
    public static void main(String[] args) {
        new Greeter().greet("Java");
    }
}`,
                output: 'Hello, Java',
                lineNotes: {
                  1: '`class Greeter`：非 public 类，可以和 `public class Main` 放在同一个文件里。',
                  2: '`void greet(String name)`：方法接收一个 `String` 参数，不返回值。`String` 是引用类型。',
                  3: '字符串 `+` 拼接：左边是字符串时，右边会被转换成字符串。',
                  9: '`new Greeter()`：创建对象；`.greet("Java")` 调用对象的方法。',
                  8: 'JVM 实际执行的是 `Main.main`，`Greeter` 只是被调用。',
                },
                takeaway:
                  '**一般形式**：一个文件可以有多个类，但最多一个 `public` 类，且 public 类名必须与文件名一致。',
              },
            ],
          },
        },
        {
          id: 'c0l1-s5',
          type: 'quiz',
          content: {
            kind: 'choice',
            question: '执行 `javac Hello.java` 之后，默认会在同一目录得到什么？',
            options: [
              '`Hello.class`，包含 JVM 字节码',
              '`Hello.exe`，包含当前平台的机器码',
              '`Hello.jar`，包含源码与依赖',
              '没有产物，javac 只做语法检查',
            ],
            answerIndex: 0,
            explanation:
              '`javac` 生成 `.class` 字节码文件。`.jar` 是打包格式，不是单文件编译的默认产物；机器码由 JVM 在运行时生成。',
          },
        },
        {
          id: 'c0l1-s6',
          type: 'coding',
          content: {
            exerciseId: 'c0l1-print',
            task: '从标准输入读入一行名字，输出 `Hello, <名字>!`。名字可能包含空格，请使用 `nextLine()`。',
            io: `输入：一行字符串（可能含空格）
输出：Hello, <名字>!
样例：输入 "Java Learner" → 输出 "Hello, Java Learner!"
约束：只读一行；使用 java.util.Scanner。`,
            skeleton: `import java.util.Scanner;

public class Main {
    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);
        // 在这里读取一行并输出
    }
}`,
            hints: [
              '概念回顾：`Scanner.nextLine()` 读取整行，不会像 `next()` 那样在空格处停下。',
              '解题方向：先调用一次 `nextLine()` 得到 name，再用字符串拼接输出。',
              '关键 API：`Scanner.nextLine`、`System.out.println`。',
            ],
            tests: [
              {
                label: '普通名字',
                kind: 'normal',
                stdin: 'Java Learner\n',
                expectedStdout: 'Hello, Java Learner!\n',
              },
              {
                label: '空行',
                kind: 'edge',
                stdin: '\n',
                expectedStdout: 'Hello, !\n',
              },
              {
                label: '首尾空格',
                kind: 'tricky',
                stdin: '  Ada  \n',
                expectedStdout: 'Hello,   Ada  !\n',
              },
            ],
            answer: `import java.util.Scanner;

public class Main {
    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);
        String name = scanner.nextLine();
        System.out.println("Hello, " + name + "!");
    }
}`,
            answerWhy:
              '`nextLine()` 保留行内空格，只去掉行尾换行，因此名字里的空格不会被截断。`println` 自动补行尾换行。',
          },
        },
        {
          id: 'c0l1-s7',
          type: 'summary',
          content: {
            points: [
              {
                kind: 'general',
                text: '**一般规则**：Java 源码先编译成字节码，再由 JVM 加载执行；编译器与运行时是两件事。',
              },
              {
                kind: 'general',
                text: '**一般规则**：可运行入口是类中的 `public static void main(String[] args)`，JVM 从它开始执行。',
              },
              {
                kind: 'general',
                text: '**一般规则**：public 类名与文件名必须一致；一个文件可以有多个非 public 类。',
              },
              {
                kind: 'scenario',
                text: '最小程序与两数协作都遵循同一套编译—加载—执行流程，场景不改变机制。',
              },
            ],
          },
        },
        {
          id: 'c0l1-s8',
          type: 'pitfall',
          content: {
            items: [
              {
                wrong: 'javac Hello.java\njava Hello.class',
                why: '`java` 接收的是**类名**，不是文件名；`.class` 后缀会被当成类名的一部分。',
                right: 'javac Hello.java\njava Hello',
              },
              {
                wrong: '把 public class Hello 写在 Main.java 里',
                why: 'public 类的名字必须与文件名一致，否则 `javac` 直接报错。',
                right: '文件名改为 Hello.java，或把类改成非 public 的 class Hello。',
              },
              {
                wrong: '认为 .class 就是当前平台的机器码',
                why: '`.class` 是 JVM 字节码，需要 JVM 解释或 JIT 编译后才能在当前 CPU 上执行。',
                right: '把 `.class` 理解为“JVM 的指令集”，不是 x86/ARM 机器码。',
              },
            ],
          },
        },
      ],
    },
    {
      id: 'c0l2',
      chapter: 0,
      title: 'JDK、JRE、JVM 的关系',
      summary: 'JVM 执行字节码，JRE 提供运行环境，JDK 在 JRE 之上再加开发工具。',
      steps: [
        {
          id: 'c0l2-s1',
          type: 'goal',
          content: {
            text: '你能区分 JDK、JRE、JVM，并解释为什么写代码需要 JDK，而运行程序通常只需要 JRE。',
            checklist: ['记住三者的包含关系', '知道 javac 属于哪一层', '能解释编译期与运行期的分界'],
          },
        },
        {
          id: 'c0l2-s2',
          type: 'concept',
          content: {
            title: '包含关系与职责',
            paragraphs: [
              '**JVM**（Java Virtual Machine）：执行字节码的虚拟机。它负责类加载、内存管理、垃圾回收、JIT 编译等。',
              '**JRE**（Java Runtime Environment）：运行 Java 程序所需的环境，包含 JVM 与标准类库（Java SE API）。',
              '**JDK**（Java Development Kit）：开发工具包，包含 JRE，再加上 `javac`、`javadoc`、`jar` 等开发工具。',
            ],
            table: {
              headers: ['组件', '包含什么', '你什么时候需要它'],
              rows: [
                ['JVM', '字节码执行引擎、运行时内存管理', '只要运行 Java 程序就需要'],
                ['JRE', 'JVM + 标准类库', '运行已编译的程序'],
                ['JDK', 'JRE + javac / jar / javadoc 等', '写代码、编译代码'],
              ],
            },
            note: '从 Java 11 起，Oracle 不再单独发布 JRE 安装包；但“JDK 包含 JRE 能力”这个关系仍然成立。',
          },
        },
        {
          id: 'c0l2-s3',
          type: 'concept',
          content: {
            title: '和 Go / Python 对照',
            paragraphs: [
              'Go 的工具链把编译器和运行时打包在一起，`go build` 产出可执行文件；部署时通常不需要在目标机器安装 Go。',
              'Python 需要解释器（如 CPython）与标准库；`pip` 安装的第三方包是另一层。',
              'Java 的 JDK 同时承担“编译”和“运行”，但两者在概念上可以拆开。',
            ],
            table: {
              headers: ['角色', 'Java', 'Go', 'Python'],
              rows: [
                ['编译器', '`javac`', '`go build`', '通常无独立编译步骤'],
                ['运行时', 'JVM', 'Go runtime（链接进可执行文件）', 'Python 解释器'],
                ['标准库', 'JDK 中的 Java SE API', 'Go 标准库', 'Python 标准库'],
                ['部署依赖', '目标机有 JVM / JRE', '通常无', '目标机有解释器'],
              ],
            },
          },
        },
        {
          id: 'c0l2-s4',
          type: 'example',
          content: {
            intro: '两个场景分别看“运行时能读到什么”和“编译期会拦住什么”。',
            scenarios: [
              {
                name: '场景 1：读取 JVM 属性',
                code: `public class RuntimeInfo {
    public static void main(String[] args) {
        System.out.println(System.getProperty("java.version"));
        System.out.println(System.getProperty("java.vm.name"));
    }
}`,
                output: '17.0.19\nOpenJDK 64-Bit Server VM',
                lineNotes: {
                  1: '`public class RuntimeInfo`：文件名需要是 RuntimeInfo.java。',
                  2: '入口方法。',
                  3: '`System.getProperty("java.version")` 读取 JVM 启动时设置的系统属性，返回字符串。',
                  4: '`"java.vm.name"` 是虚拟机实现名称；属性值随运行环境变化。',
                },
                takeaway: '运行时信息来自 JVM 的属性表；同一份字节码在不同 JVM 上可能读到不同的值。',
              },
              {
                name: '场景 2：编译期会拦住类型错误',
                code: `public class CompileVsRun {
    public static void main(String[] args) {
        int number = "42";          // 编译错误：类型不兼容
        System.out.println(number);
    }
}`,
                lineNotes: {
                  1: '`public class CompileVsRun`。',
                  2: '入口方法。',
                  3: '`int number = "42";`：`String` 不能自动转成 `int`，`javac` 在编译期就拒绝，程序不会进入 JVM 运行阶段。',
                  4: '这行不会被执行到，因为编译已经失败。',
                },
                takeaway: '**一般形式**：类型错误在编译期暴露；JVM 只接收通过 `javac` 检查的字节码。',
              },
            ],
          },
        },
        {
          id: 'c0l2-s5',
          type: 'quiz',
          content: {
            kind: 'judge',
            statement: '一台机器只安装了 JRE，也可以用 `javac` 编译 `.java` 源文件。',
            answer: false,
            explanation: '`javac` 属于 JDK。JRE 只提供运行环境，不包含开发工具。',
          },
        },
        {
          id: 'c0l2-s6',
          type: 'quiz',
          content: {
            kind: 'fill',
            question: '运行已编译的 Java 程序，最低需要的是 ___（填 JRE、JVM、JDK 之一）。',
            before: '最低需要：',
            after: '。',
            answers: ['JRE', 'JDK'],
            placeholder: 'JRE / JVM / JDK',
            explanation:
              'JRE 提供 JVM 与标准类库。JDK 也包含 JRE，因此也能运行，但它是更大的集合，不是最低需求。',
          },
        },
        {
          id: 'c0l2-s7',
          type: 'coding',
          content: {
            exerciseId: 'c0l2-component',
            task: '读入一个整数 code（1、2、3），输出对应组件的职责：1 → `JDK: development kit`，2 → `JRE: runtime environment`，3 → `JVM: virtual machine`，其他 → `unknown`。',
            io: `输入：一个整数
输出：对应的一行说明
样例：输入 2 → 输出 JRE: runtime environment
约束：只处理 1、2、3；其他值输出 unknown。`,
            skeleton: `import java.util.Scanner;

public class Main {
    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);
        int code = scanner.nextInt();
        // 根据 code 输出对应说明
    }
}`,
            hints: [
              '概念回顾：JDK 包含 JRE，JRE 包含 JVM；三者的职责依次是开发、运行、执行字节码。',
              '解题方向：用 if / else if 依次判断 1、2、3，其余走 else。',
              '关键 API：`if / else if / else`、`System.out.println`。',
            ],
            tests: [
              {
                label: 'JRE',
                kind: 'normal',
                stdin: '2\n',
                expectedStdout: 'JRE: runtime environment\n',
              },
              {
                label: '未知编号',
                kind: 'edge',
                stdin: '4\n',
                expectedStdout: 'unknown\n',
              },
              {
                label: 'JVM',
                kind: 'tricky',
                stdin: '3\n',
                expectedStdout: 'JVM: virtual machine\n',
              },
            ],
            answer: `import java.util.Scanner;

public class Main {
    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);
        int code = scanner.nextInt();
        if (code == 1) {
            System.out.println("JDK: development kit");
        } else if (code == 2) {
            System.out.println("JRE: runtime environment");
        } else if (code == 3) {
            System.out.println("JVM: virtual machine");
        } else {
            System.out.println("unknown");
        }
    }
}`,
            answerWhy:
              '把编号到文本的映射写成互斥分支，最后用 else 兜底未知输入；这样不会漏掉 4 之类的边界值。',
          },
        },
        {
          id: 'c0l2-s8',
          type: 'summary',
          content: {
            points: [
              {
                kind: 'general',
                text: '**一般规则**：JVM 是执行字节码的运行时；JRE = JVM + 标准类库；JDK = JRE + 开发工具。',
              },
              {
                kind: 'general',
                text: '**一般规则**：编译期错误由 `javac` 拦截，运行时行为由 JVM 决定，两者不要混为一谈。',
              },
              {
                kind: 'scenario',
                text: '开发机需要 JDK；只运行已编译程序的服务器最低需要 JRE（或包含 JRE 的 JDK）。',
              },
            ],
          },
        },
        {
          id: 'c0l2-s9',
          type: 'pitfall',
          content: {
            items: [
              {
                wrong: '认为 JVM 就是 JDK，装了 JDK 就一定有独立的 JRE 安装包',
                why: 'JDK 包含 JRE 的能力，但 Java 11+ 不再单独分发 JRE；概念上的包含关系不等于安装包形态。',
                right: '把 JDK 理解为开发工具包，它包含运行程序所需的 JVM 与类库。',
              },
              {
                wrong: '认为 javac 属于 JVM',
                why: '`javac` 是 JDK 提供的编译器，JVM 只负责运行字节码。',
                right: '用 JDK 的 javac 编译，用 JVM 运行。',
              },
            ],
          },
        },
      ],
    },
    {
      id: 'c0l3',
      chapter: 0,
      title: 'main 方法签名',
      summary: 'main 的四个关键字各有职责；args 是启动参数数组，不是普通业务输入。',
      steps: [
        {
          id: 'c0l3-s1',
          type: 'goal',
          content: {
            text: '你能逐字解释 `public static void main(String[] args)`，并知道 `args` 从哪里来。',
            checklist: ['说出 public / static / void 的作用', '知道 args 不含程序名', '访问 args 前先检查长度'],
          },
        },
        {
          id: 'c0l3-s2',
          type: 'concept',
          content: {
            title: '逐个关键字',
            paragraphs: [
              '`public`：JVM 需要从类外部调用它，所以必须是 public。',
              '`static`：入口方法在创建任何对象之前就要能调用，因此不能依赖实例。',
              '`void`：入口方法不向 JVM 返回结果；进程退出码由 `System.exit` 或异常决定。',
              '`String[] args`：字符串数组，接收命令行参数；没有参数时是长度为 0 的数组，不是 null。',
            ],
            table: {
              headers: ['部分', '含义', '写错的后果'],
              rows: [
                ['public', '对外可见', 'JVM 找不到入口，报 main method not found'],
                ['static', '不依赖实例', '同样找不到可调用的入口'],
                ['void', '无返回值', '签名不匹配'],
                ['String[] args', '命令行参数', '签名不匹配；args 不会自动为 null'],
              ],
            },
            note: '方法名必须是 `main`，参数类型必须是 `String[]`（或 `String...`，二者字节码等价）。返回类型只能是 `void`。',
          },
        },
        {
          id: 'c0l3-s3',
          type: 'concept',
          content: {
            title: 'args 与 Go / Python 的对照',
            paragraphs: [
              '命令行 `java Main Alice Bob` 中，`Main` 是类名，后面的 `Alice Bob` 进入 `args`。',
              'Go 的 `os.Args[0]` 是程序名，真正的参数从 `os.Args[1]` 开始；Java 的 `args` **不包含**类名或程序名。',
              'Python 的 `sys.argv[0]` 是脚本名，参数从 `sys.argv[1]` 开始。',
            ],
            table: {
              headers: ['场景', 'Java', 'Go', 'Python'],
              rows: [
                ['第一个参数', '`args[0]`', '`os.Args[1]`', '`sys.argv[1]`'],
                ['是否含程序名', '不含', '含（`os.Args[0]`）', '含（`sys.argv[0]`）'],
                ['无参数时', '`args.length == 0`', '`len(os.Args) == 1`', '`len(sys.argv) == 1`'],
              ],
            },
          },
        },
        {
          id: 'c0l3-s4',
          type: 'example',
          content: {
            intro: '一个例子看遍历，一个例子看防御。',
            scenarios: [
              {
                name: '场景 1：打印启动参数',
                code: `public class ArgsDemo {
    public static void main(String[] args) {
        System.out.println("参数个数: " + args.length);
        for (int i = 0; i < args.length; i++) {
            System.out.println("args[" + i + "] = " + args[i]);
        }
    }
}`,
                output: '（运行 java ArgsDemo Alice Bob）\n参数个数: 2\nargs[0] = Alice\nargs[1] = Bob',
                lineNotes: {
                  2: '`args` 由 JVM 根据命令行参数构造；无参数时长度为 0。',
                  3: '`args.length`：数组长度是字段，不是方法。',
                  4: '普通 for 循环遍历数组，下标从 0 到 `length - 1`。',
                  5: '`args[i]` 按下标取字符串；`+` 把各部分拼成文本。',
                },
                takeaway:
                  '**一般规则**：`args` 是 JVM 传入的字符串数组，长度可以为 0；访问元素前先检查 `length`。',
              },
              {
                name: '场景 2：参数缺失时的防御',
                code: `public class NeedName {
    public static void main(String[] args) {
        if (args.length == 0) {
            System.out.println("请提供一个名字");
            return;
        }
        System.out.println("Hello, " + args[0]);
    }
}`,
                output: '（java NeedName）\n请提供一个名字\n（java NeedName Ada）\nHello, Ada',
                lineNotes: {
                  3: '先检查长度，避免访问 `args[0]` 时越界。',
                  5: '提前 `return` 结束 main；这是常见的防御式写法。',
                  7: '只有 args 非空时才会执行到这里。',
                },
                takeaway: '**一般规则**：外部输入先验证再使用；数组访问尤其要先检查长度。',
              },
            ],
          },
        },
        {
          id: 'c0l3-s5',
          type: 'quiz',
          content: {
            kind: 'fill',
            question: '补全入口方法签名：',
            before: 'public static ',
            after: ' main(String[] args)',
            answers: ['void'],
            placeholder: '返回类型',
            explanation: '`main` 必须返回 `void`；返回其他类型会导致 JVM 找不到入口。',
          },
        },
        {
          id: 'c0l3-s6',
          type: 'coding',
          content: {
            exerciseId: 'c0l3-args',
            task: '打印所有命令行参数的序号与值：每行 `i=参数值`，`i` 从 0 开始。没有参数时输出 `no args`。',
            io: `输入：命令行参数（不是 stdin）
输出：每个参数一行 i=值；无参数时一行 no args
样例：参数 Java 17 → 两行：0=Java、1=17
约束：使用 args.length 判断是否为空。`,
            skeleton: `public class Main {
    public static void main(String[] args) {
        // 在这里处理 args
    }
}`,
            hints: [
              '概念回顾：`args` 的长度用 `args.length`，不是 `args.length()`。',
              '解题方向：先判断长度是否为 0；否则用 for 循环按下标输出。',
              '关键 API：`args.length`、`System.out.println`、字符串拼接。',
            ],
            tests: [
              {
                label: '两个参数',
                kind: 'normal',
                args: ['Java', '17'],
                expectedStdout: '0=Java\n1=17\n',
              },
              {
                label: '没有参数',
                kind: 'edge',
                args: [],
                expectedStdout: 'no args\n',
              },
              {
                label: '含空参数',
                kind: 'tricky',
                args: ['a b', ''],
                expectedStdout: '0=a b\n1=\n',
              },
            ],
            answer: `public class Main {
    public static void main(String[] args) {
        if (args.length == 0) {
            System.out.println("no args");
            return;
        }
        for (int i = 0; i < args.length; i++) {
            System.out.println(i + "=" + args[i]);
        }
    }
}`,
            answerWhy:
              '数组长度是字段 `length`。`i + "=" + args[i]` 从左到右拼接，`i` 会先转成字符串；空参数仍会作为空字符串出现在输出里。',
          },
        },
        {
          id: 'c0l3-s7',
          type: 'summary',
          content: {
            points: [
              {
                kind: 'general',
                text: '**一般规则**：入口签名固定为 `public static void main(String[] args)`；四个部分缺一不可。',
              },
              {
                kind: 'general',
                text: '**一般规则**：`args` 是 JVM 构造的字符串数组，无参数时长度为 0；访问元素前必须检查长度。',
              },
              {
                kind: 'general',
                text: '**一般规则**：数组长度是字段 `length`，不是方法 `length()`。',
              },
              {
                kind: 'scenario',
                text: '命令行参数、Go 的 `os.Args`、Python 的 `sys.argv` 都是外部输入，区别只在是否包含程序名和起始下标。',
              },
            ],
          },
        },
        {
          id: 'c0l3-s8',
          type: 'pitfall',
          content: {
            items: [
              {
                wrong: 'public static void main(String args)',
                why: '参数必须是 `String[]`（或可变参数 `String...`），单个 String 不匹配入口签名。',
                right: 'public static void main(String[] args)',
              },
              {
                wrong: 'if (args != null) { ... args[0] ... }',
                why: '无参数时 args 不是 null，而是长度 0 的数组；判断 null 挡不住下标越界。',
                right: 'if (args.length > 0) { ... args[0] ... }',
              },
              {
                wrong: 'args.length()',
                why: '数组长度是字段，不是方法；`length()` 是字符串的方法。',
                right: 'args.length',
              },
            ],
          },
        },
      ],
    },
    {
      id: 'c0l4',
      chapter: 0,
      title: 'package 与 import',
      summary: 'package 是命名空间与目录约定，import 只是简化类名引用。',
      steps: [
        {
          id: 'c0l4-s1',
          type: 'goal',
          content: {
            text: '你能解释 package 的作用、目录约定，以及 import 到底做了什么。',
            checklist: ['知道全限定名', '理解 import 不加载类', '能处理同名类冲突'],
          },
        },
        {
          id: 'c0l4-s2',
          type: 'concept',
          content: {
            title: 'package：给类一个全局唯一的名字',
            paragraphs: [
              '`package com.example.app;` 声明当前文件中的类属于哪个包。包名通常与目录结构一致：`com/example/app/Hello.java`。',
              '包的作用是**避免类名冲突**并提供访问边界；不同包中可以有同名类。',
              '没有 package 声明的类属于**默认包**（unnamed package）。教学练习通常使用默认包。',
              '类的全限定名是 `包名.类名`，例如 `java.util.Scanner`。',
            ],
            table: {
              headers: ['概念', 'Java', 'Go', 'Python'],
              rows: [
                ['命名空间单位', 'package', 'package', 'module / package'],
                ['目录约定', '包名对应目录', '包名对应目录', '模块对应文件 / 目录'],
                ['引用方式', '`import` 或全限定名', '`import` 路径', '`import` 模块'],
                ['默认包', '允许（不推荐正式项目）', '没有默认包概念', '没有默认包概念'],
              ],
            },
            note: '`import` 不会把代码复制进来，也不会加载类；它只是让编译器知道 `Scanner` 指向 `java.util.Scanner`。',
          },
        },
        {
          id: 'c0l4-s3',
          type: 'concept',
          content: {
            title: 'import 的两种形式',
            paragraphs: [
              '单类型导入：`import java.util.Scanner;`，之后可以直接写 `Scanner`。',
              '按需导入：`import java.util.*;`，导入该包下的类型，但**不会递归导入子包**，也不影响运行时性能。',
              '`java.lang` 包（如 `String`、`System`、`Math`）自动导入，不需要写 `import`。',
              '同名类冲突时，必须使用全限定名，例如 `java.util.Date` 与 `java.sql.Date`。',
            ],
            table: {
              headers: ['写法', '作用', '注意'],
              rows: [
                ['`import java.util.Scanner;`', '导入单个类', '最清晰，推荐'],
                ['`import java.util.*;`', '导入包中的类型', '不递归；可能带来同名冲突'],
                ['`java.util.Scanner s = ...`', '使用全限定名', '无需 import，适合解决冲突'],
              ],
            },
          },
        },
        {
          id: 'c0l4-s4',
          type: 'example',
          content: {
            intro: '一个例子看 import 带来的简洁，另一个看冲突时如何退回全限定名。',
            scenarios: [
              {
                name: '场景 1：使用 import 简化类名',
                code: `import java.util.Scanner;

public class ImportDemo {
    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);
        String line = scanner.nextLine();
        System.out.println(line.toUpperCase());
    }
}`,
                output: '（输入 hello）\nHELLO',
                lineNotes: {
                  1: '`import java.util.Scanner;` 告诉编译器 `Scanner` 指哪个类；import 必须在 package 之后、类声明之前。',
                  3: '默认包中的类；文件名需要是 ImportDemo.java。',
                  5: '使用简单名 `Scanner`，因为已经 import。',
                  6: '`nextLine()` 读取一整行。',
                  7: '`toUpperCase()` 返回新字符串，原字符串不变。',
                },
                takeaway: '`import` 是编译期的名字解析工具，不改变程序行为。',
              },
              {
                name: '场景 2：同名类冲突时用全限定名',
                code: `import java.util.Date;

public class DateConflict {
    public static void main(String[] args) {
        Date utilDate = new Date();
        java.sql.Date sqlDate = new java.sql.Date(0L);
        System.out.println(utilDate.getClass().getName());
        System.out.println(sqlDate.getClass().getName());
    }
}`,
                output: 'java.util.Date\njava.sql.Date',
                lineNotes: {
                  1: '`import java.util.Date;` 让简单名 `Date` 指向 `java.util.Date`。',
                  5: '`new Date()` 使用简单名，创建 `java.util.Date`。',
                  6: '`java.sql.Date` 全限定名绕过 import 冲突；`0L` 是 long 字面量。',
                  7: '`getClass().getName()` 返回运行时类的全限定名。',
                },
                takeaway:
                  '**一般规则**：简单名有歧义时，用全限定名消除歧义；import 只影响简单名的解析。',
              },
            ],
          },
        },
        {
          id: 'c0l4-s5',
          type: 'quiz',
          content: {
            kind: 'choice',
            question: '关于 `import java.util.*;`，哪一项正确？',
            options: [
              '导入 `java.util` 包中的类型，但不会递归导入 `java.util.concurrent` 等子包',
              '把 `java.util` 包的所有源码复制到当前文件',
              '在运行时加载 `java.util` 包中的所有类',
              '可以省略 `java.lang` 的自动导入规则',
            ],
            answerIndex: 0,
            explanation:
              '按需导入只覆盖该包中的类型，不递归子包，也不会在运行时加载全部类；`java.lang` 仍然自动导入。',
          },
        },
        {
          id: 'c0l4-s6',
          type: 'coding',
          content: {
            exerciseId: 'c0l4-scanner',
            task: '读入两个整数（可能分两行，也可能在同一行），输出它们的和。使用 `Scanner`。',
            io: `输入：两个整数，以空白分隔
输出：一个整数
样例：输入 "3 5" → 输出 8
约束：使用 java.util.Scanner；不要假设一定分两行。`,
            skeleton: `import java.util.Scanner;

public class Main {
    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);
        // 读取两个整数并输出和
    }
}`,
            hints: [
              '概念回顾：`Scanner.nextInt()` 会跳过空白，因此换行和空格都可以作为分隔。',
              '解题方向：用两次 `nextInt()` 读取，相加后输出。',
              '关键 API：`Scanner.nextInt`、`System.out.println`。',
            ],
            tests: [
              {
                label: '同一行',
                kind: 'normal',
                stdin: '3 5\n',
                expectedStdout: '8\n',
              },
              {
                label: 'int 边界',
                kind: 'edge',
                stdin: '-2147483648 2147483647\n',
                expectedStdout: '-1\n',
              },
              {
                label: '分两行',
                kind: 'tricky',
                stdin: '3\n5\n',
                expectedStdout: '8\n',
              },
            ],
            answer: `import java.util.Scanner;

public class Main {
    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);
        int a = scanner.nextInt();
        int b = scanner.nextInt();
        System.out.println(a + b);
    }
}`,
            answerWhy:
              '`nextInt()` 按空白分词，不依赖行数；先用两个变量接住，再计算，避免把输入顺序写反。',
          },
        },
        {
          id: 'c0l4-s7',
          type: 'summary',
          content: {
            points: [
              {
                kind: 'general',
                text: '**一般规则**：package 决定类的全限定名与目录位置，import 只简化简单名引用。',
              },
              {
                kind: 'general',
                text: '**一般规则**：`java.lang` 自动导入；按需导入不递归子包；同名冲突用全限定名。',
              },
              {
                kind: 'general',
                text: '**一般规则**：教学与小型练习可用默认包，正式项目应使用反向域名式包名。',
              },
              {
                kind: 'scenario',
                text: '`Scanner`、`Date` 的例子都说明：import 是编译期名字解析，不改变运行行为。',
              },
            ],
          },
        },
        {
          id: 'c0l4-s8',
          type: 'pitfall',
          content: {
            items: [
              {
                wrong: 'import java.util.Scanner;\npackage com.example;',
                why: '`package` 声明必须是文件的第一条（注释除外），import 不能放在它前面。',
                right: 'package com.example;\nimport java.util.Scanner;',
              },
              {
                wrong: '认为 import java.util.*; 会导入子包',
                why: '按需导入只覆盖当前包中的类型，不递归子包。',
                right: '需要子包类型时单独 import，例如 import java.util.concurrent.*;',
              },
              {
                wrong: '在默认包里写 package，又要求类名匹配目录',
                why: '练习代码使用默认包，不要写 package；写了 package 就必须按目录组织并调整编译命令。',
                right: '练习中省略 package，直接写 class Main。',
              },
            ],
          },
        },
      ],
    },
  ],
}
