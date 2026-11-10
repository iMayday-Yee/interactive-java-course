import type { Chapter } from '../../types/content'

export const chapter14: Chapter = {
  id: 'chapter-14',
  number: 14,
  title: 'JVM 与内存',
  subtitle: '局部变量在栈帧里，对象在堆里，类元数据在方法区；OOM 与 StackOverflowError 分别对应堆与栈的边界。',
  lessons: [
    {
      id: 'c14l1',
      chapter: 14,
      title: '堆、栈与方法区',
      summary: '栈保存线程的调用帧与局部变量，堆保存对象与数组，方法区保存类元数据与静态信息。',
      steps: [
        {
          id: 'c14l1-s1',
          type: 'goal',
          content: {
            text: '你能说清对象、数组、局部基本类型与引用分别放在哪里，并解释为什么两个变量可以指向同一个堆对象。',
            checklist: ['知道栈是线程私有的', '知道对象与数组在堆', '知道引用变量本身在栈或对象里'],
          },
        },
        {
          id: 'c14l1-s2',
          type: 'concept',
          content: {
            title: '三个最重要的区域',
            paragraphs: [
              '**栈（Stack）**：每个线程私有；每次方法调用创建一个栈帧，保存局部变量、操作数与返回信息。方法结束，栈帧弹出。',
              '**堆（Heap）**：所有线程共享；`new` 创建的对象与数组都在这里，由垃圾回收器管理。',
              '**方法区 / 元空间**：保存类元数据、常量、静态字段等；具体实现随 JVM 版本变化，不必死记内部细节。',
              '局部基本类型（int、boolean 等）直接保存在栈帧；局部引用变量也保存在栈帧，但它指向的对象在堆。',
              '对象的实例字段随对象保存在堆；如果字段是引用，它指向另一个堆对象。',
              '两个引用变量可以指向同一个堆对象；通过一个引用修改对象内容，另一个引用能看到。',
            ],
            table: {
              headers: ['内容', '位置', '说明'],
              rows: [
                ['局部基本类型', '栈帧', '方法结束即消失'],
                ['局部引用变量', '栈帧', '引用本身在栈，对象在堆'],
                ['对象 / 数组', '堆', 'GC 管理'],
                ['实例字段', '随对象在堆', '引用字段指向其他对象'],
                ['静态字段 / 类元数据', '方法区', '全类共享'],
              ],
            },
            note: '“引用在栈、对象在堆”是理解 Java 参数传递与共享修改的关键；引用本身也是按值传递的副本。',
          },
        },
        {
          id: 'c14l1-s3',
          type: 'example',
          content: {
            scenarios: [
              {
                name: '场景 1：局部变量与堆对象',
                code: `class Point {
    int x;

    Point(int x) {
        this.x = x;
    }
}

public class MemoryDemo {
    public static void main(String[] args) {
        int local = 7;
        Point point = new Point(42);
        System.out.println(local);
        System.out.println(point.x);
    }
}`,
                output: '7\n42',
                lineNotes: {
                  2: '实例字段 x 随 Point 对象存放在堆。',
                  11: '局部基本类型 local 存在 main 的栈帧。',
                  12: 'point 引用在栈帧，new 创建的对象在堆。',
                  13: '直接输出栈中的基本类型值。',
                  14: '通过引用访问堆对象里的字段。',
                },
                takeaway: '**一般规则**：局部基本类型在栈帧，对象在堆；引用变量只是指向堆对象的地址副本。',
              },
              {
                name: '场景 2：数组在堆上',
                code: `public class ArrayMemory {
    public static void main(String[] args) {
        int[] values = new int[3];
        values[0] = 5;
        System.out.println(values.length);
        System.out.println(values[0]);
    }
}`,
                output: '3\n5',
                lineNotes: {
                  3: 'new int[3] 在堆上分配长度为 3 的数组对象。',
                  4: '通过引用把 5 写入数组第一个元素。',
                  5: 'length 是数组对象的字段，不是方法。',
                  6: '读取堆中的元素值。',
                },
                takeaway: '**一般规则**：数组是堆对象；引用在栈，元素存储在堆。',
              },
            ],
          },
        },
        {
          id: 'c14l1-s4',
          type: 'quiz',
          content: {
            kind: 'choice',
            question: '`Point p = new Point();` 中，`p` 与 `new Point()` 创建的对象分别在哪里？',
            options: [
              '都在栈',
              'p 在栈（引用），对象在堆',
              'p 在堆，对象在栈',
              '都在方法区',
            ],
            answerIndex: 1,
            explanation: '局部引用变量 p 在栈帧中；它指向的对象由 new 在堆上分配。',
          },
        },
        {
          id: 'c14l1-s5',
          type: 'coding',
          content: {
            exerciseId: 'c14l1-arrays',
            task: '读入 n 与 m，创建 n 个长度为 m 的 int 数组，输出总元素数与估算字节数（每个 int 4 字节）。',
            io: `输入：两个整数 n、m
输出：elements:<总数> bytes:<n*m*4>
样例：输入 2 3 → 输出 elements:6 bytes:24
约束：用 int[][] 实际创建数组；字节数用 long。`,
            skeleton: `import java.util.Scanner;

public class Main {
    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);
        int n = scanner.nextInt();
        int m = scanner.nextInt();
        int[][] grid = new int[n][m];
        // 输出元素数与字节数
    }
}`,
            hints: [
              '概念回顾：二维数组是“数组的数组”，每个子数组都是堆对象。',
              '解题方向：元素数为 n*m；字节数为 n*m*4L。',
              '关键 API：数组 length、long 字面量。',
            ],
            tests: [
              {
                label: '两行三列',
                kind: 'normal',
                stdin: '2 3\n',
                expectedStdout: 'elements:6 bytes:24\n',
              },
              {
                label: '一个元素',
                kind: 'edge',
                stdin: '1 1\n',
                expectedStdout: 'elements:1 bytes:4\n',
              },
              {
                label: '空行数组',
                kind: 'tricky',
                stdin: '0 5\n',
                expectedStdout: 'elements:0 bytes:0\n',
              },
            ],
            answer: `import java.util.Scanner;

public class Main {
    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);
        int n = scanner.nextInt();
        int m = scanner.nextInt();
        int[][] grid = new int[n][m];
        long elements = (long) n * m;
        System.out.println("elements:" + elements + " bytes:" + (elements * 4));
    }
}`,
            answerWhy:
              'new int[n][m] 在堆上创建 n 个子数组；元素总数是 n*m。用 long 计算字节数，避免大 n、m 时 int 溢出。',
          },
        },
        {
          id: 'c14l1-s6',
          type: 'summary',
          content: {
            points: [
              {
                kind: 'general',
                text: '**一般规则**：栈是线程私有的调用帧；局部变量与引用保存在栈帧。',
              },
              {
                kind: 'general',
                text: '**一般规则**：对象与数组在堆，由 GC 管理；引用字段指向其他堆对象。',
              },
              {
                kind: 'general',
                text: '**一般规则**：两个引用可指向同一对象；修改对象内容对两个引用都可见。',
              },
              {
                kind: 'scenario',
                text: 'Point 展示栈上引用与堆对象；数组展示堆上的元素存储。',
              },
            ],
          },
        },
        {
          id: 'c14l1-s7',
          type: 'pitfall',
          content: {
            items: [
              {
                wrong: '认为局部变量 `Point p` 里直接存了对象的所有字段。',
                why: 'p 存的是引用；对象字段在堆上。',
                right: '区分引用变量与它指向的对象。',
              },
              {
                wrong: '认为基本类型字段也单独在栈上。',
                why: '实例字段随对象在堆；只有局部基本类型在栈帧。',
                right: '按“声明位置”判断存储位置。',
              },
              {
                wrong: '以为方法结束后对象一定立刻消失。',
                why: '对象是否回收取决于是否仍可达，由 GC 决定，不是栈帧弹出就立即释放。',
                right: '关注引用可达性，不要依赖“立即回收”。',
              },
            ],
          },
        },
      ],
    },
    {
      id: 'c14l2',
      chapter: 14,
      title: 'OutOfMemoryError 与 StackOverflowError',
      summary: 'OOM 通常来自堆中存活对象过多或单次分配过大；StackOverflowError 来自调用栈过深。两者都是 Error。',
      steps: [
        {
          id: 'c14l2-s1',
          type: 'goal',
          content: {
            text: '你能区分 OOM 与 StackOverflowError 的成因，知道它们属于 Error，并写出不会无限递归的边界条件。',
            checklist: ['知道 OOM 与堆有关', '知道 SOE 与调用栈深度有关', '知道 Error 通常不应被业务吞掉'],
          },
        },
        {
          id: 'c14l2-s2',
          type: 'concept',
          content: {
            title: '两种边界：堆满与栈深',
            paragraphs: [
              '`OutOfMemoryError`：堆无法再分配对象，常见于超大数组、一次性加载大文件、对象泄漏导致存活对象持续增长。',
              '`StackOverflowError`：调用栈深度超过限制，最常见原因是递归缺少终止条件或递归层数过深。',
              '两者都继承 `Error`，不是 `Exception`；应用通常不应捕获后继续运行，因为 JVM 状态可能已不可靠。',
              '堆大小可用 `-Xmx` 调整，栈大小可用 `-Xss` 调整；但调大只是推迟问题，根因仍是内存使用或递归设计。',
              '递归必须有明确的基准情形，并确保每次递归向基准靠近；深度不确定时改用迭代。',
              '诊断 OOM 要看对象为何长期存活（引用链、缓存、集合增长）；诊断 SOE 要看递归与调用链。',
            ],
            table: {
              headers: ['错误', '资源', '常见原因', '处理方向'],
              rows: [
                ['`OutOfMemoryError`', '堆', '大数组、泄漏、缓存无界', '减少存活对象、分析堆'],
                ['`StackOverflowError`', '调用栈', '无限递归、递归过深', '补终止条件、改迭代'],
                ['`Error`', 'JVM 级', '不应按业务异常处理', '修复根因'],
              ],
            },
            note: '`catch (Exception e)` 捕获不到 Error；需要时只能显式 catch Error，但通常不应这样做。',
          },
        },
        {
          id: 'c14l2-s3',
          type: 'example',
          content: {
            scenarios: [
              {
                name: '场景 1：无限递归导致 StackOverflowError',
                code: `public class StackDemo {
    static void recurse() {
        recurse();
    }

    public static void main(String[] args) {
        recurse();
    }
}`,
                output: 'Exception in thread "main" java.lang.StackOverflowError',
                lineNotes: {
                  2: '每次调用都会创建新的栈帧。',
                  3: '没有任何终止条件，递归无限进行。',
                  7: '最终栈空间耗尽，抛出 StackOverflowError。',
                },
                takeaway: '**一般规则**：递归必须有基准情形；不确定深度时改用迭代，避免栈溢出。',
              },
              {
                name: '场景 2：超大数组导致 OutOfMemoryError',
                code: `public class HeapDemo {
    public static void main(String[] args) {
        long[] data = new long[Integer.MAX_VALUE];
        System.out.println(data.length);
    }
}`,
                output: 'Exception in thread "main" java.lang.OutOfMemoryError: Requested array size exceeds VM limit',
                lineNotes: {
                  3: '尝试分配极大的数组；所需连续堆空间超出限制。',
                  4: '分配失败，后面的打印不会执行。',
                },
                takeaway: '**一般规则**：单次分配要与可用堆匹配；大文件/大数据集应分块处理，而不是一次性载入。',
              },
            ],
          },
        },
        {
          id: 'c14l2-s4',
          type: 'quiz',
          content: {
            kind: 'choice',
            question: '关于 `StackOverflowError`，哪一句正确？',
            options: [
              '它是 Exception，业务代码应捕获后继续',
              '它通常来自调用栈过深，例如无限递归',
              '它与堆内存大小直接相关',
              '它只能通过增大堆解决',
            ],
            answerIndex: 1,
            explanation: 'SOE 属于 Error，通常由递归过深或无限递归导致；调整栈大小只能推迟，根因是递归设计。',
          },
        },
        {
          id: 'c14l2-s5',
          type: 'coding',
          content: {
            exerciseId: 'c14l2-recursion',
            task: '读入 n（1 ≤ n ≤ 1000），用递归计算 1+2+...+n，输出 `sum:<结果> depth:<n>`。',
            io: `输入：一个整数 n
输出：sum:结果 depth:n
样例：输入 10 → 输出 sum:55 depth:10
约束：必须使用递归，并保证有终止条件。`,
            skeleton: `import java.util.Scanner;

public class Main {
    static int sum(int n) {
        // 递归：终止条件 + 向基准靠近
        return 0;
    }

    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);
        int n = scanner.nextInt();
        System.out.println("sum:" + sum(n) + " depth:" + n);
    }
}`,
            hints: [
              '概念回顾：递归必须有基准情形，每次调用向基准靠近。',
              '解题方向：n == 0 时返回 0；否则返回 n + sum(n - 1)。',
              '关键 API：不需要额外 API。',
            ],
            tests: [
              {
                label: '十层递归',
                kind: 'normal',
                stdin: '10\n',
                expectedStdout: 'sum:55 depth:10\n',
              },
              {
                label: '一层递归',
                kind: 'edge',
                stdin: '1\n',
                expectedStdout: 'sum:1 depth:1\n',
              },
              {
                label: '较深层数',
                kind: 'tricky',
                stdin: '1000\n',
                expectedStdout: 'sum:500500 depth:1000\n',
              },
            ],
            answer: `import java.util.Scanner;

public class Main {
    static int sum(int n) {
        if (n == 0) {
            return 0;
        }
        return n + sum(n - 1);
    }

    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);
        int n = scanner.nextInt();
        System.out.println("sum:" + sum(n) + " depth:" + n);
    }
}`,
            answerWhy:
              '基准情形 n == 0 终止递归，每次 n-1 向基准靠近。1000 层在默认栈大小内通常安全；再深应考虑迭代或调整 -Xss。',
          },
        },
        {
          id: 'c14l2-s6',
          type: 'summary',
          content: {
            points: [
              {
                kind: 'general',
                text: '**一般规则**：OOM 与堆有关，SOE 与调用栈深度有关；两者都是 Error。',
              },
              {
                kind: 'general',
                text: '**一般规则**：递归必须有基准情形并向基准靠近；深度不确定时用迭代。',
              },
              {
                kind: 'general',
                text: '**一般规则**：调大 -Xmx / -Xss 只能推迟问题；根因是对象存活量或递归设计。',
              },
              {
                kind: 'scenario',
                text: '无限递归展示 SOE；超大数组展示 OOM。',
              },
            ],
          },
        },
        {
          id: 'c14l2-s7',
          type: 'pitfall',
          content: {
            items: [
              {
                wrong: 'catch (Exception e) 期待捕获 OutOfMemoryError。',
                why: 'OOM 是 Error，不是 Exception，catch Exception 捕获不到。',
                right: '修复内存使用；不要把它当业务异常继续。',
              },
              {
                wrong: '递归只在“正常输入”下设置终止条件。',
                why: '边界输入或异常路径可能绕过终止条件，导致无限递归。',
                right: '保证所有路径都向基准靠近，并为边界写测试。',
              },
              {
                wrong: '把大文件一次性读入内存，OOM 后只调大堆。',
                why: '数据规模增长会继续超过堆，调大不是可扩展方案。',
                right: '流式 / 分块处理，控制同时驻留的数据量。',
              },
            ],
          },
        },
      ],
    },
  ],
}
