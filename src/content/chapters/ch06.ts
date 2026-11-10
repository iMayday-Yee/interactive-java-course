import type { Chapter } from '../../types/content'

export const chapter06: Chapter = {
  id: 'chapter-6',
  number: 6,
  title: '异常',
  subtitle: 'Throwable 的层级、受检与非受检、finally 的执行、try-with-resources 与自定义异常。重点是“在哪一层处理”。',
  lessons: [
    {
      id: 'c6l1',
      chapter: 6,
      title: 'Throwable 体系与受检 / 非受检异常',
      summary: 'Error 通常不可恢复；Exception 分受检与非受检，受检异常必须捕获或声明抛出。',
      steps: [
        {
          id: 'c6l1-s1',
          type: 'goal',
          content: {
            text: '你能画出 Throwable 的主要分支，判断一个异常是受检还是非受检，并知道何时 catch、何时 throws。',
            checklist: ['区分 Error 与 Exception', '知道 RuntimeException 是非受检', '知道受检异常必须处理或声明'],
          },
        },
        {
          id: 'c6l1-s2',
          type: 'concept',
          content: {
            title: 'Error、受检异常、非受检异常',
            paragraphs: [
              '所有可抛出的对象都继承 `Throwable`。它分成 `Error` 与 `Exception` 两支。',
              '`Error` 表示 JVM 层面的严重问题，例如 `OutOfMemoryError`、`StackOverflowError`；应用通常不应捕获并继续。',
              '`Exception` 中，`RuntimeException` 及其子类是非受检异常（unchecked），例如空指针、数组越界、数字格式错误。',
              '其他 Exception 子类是受检异常（checked），例如 `IOException`、`InterruptedException`；编译器要求你 catch 或用 `throws` 声明。',
              '受检异常把“可能失败”写进方法签名，调用方必须面对；非受检异常通常表示编程错误，应通过修正代码避免。',
              'Go 用显式 error 返回值，Python 用异常但不区分受检；Java 的受检异常是编译期强制。',
            ],
            table: {
              headers: ['语言', '错误传递', '编译期强制'],
              rows: [
                ['Java 受检异常', '`throws` / `catch`', '是'],
                ['Java 非受检异常', '运行时抛出', '否'],
                ['Go', '返回 `error` 值', '调用方自觉检查'],
                ['Python', '抛出异常', '否'],
              ],
            },
            note: '不要用 `catch (Exception e)` 包住所有逻辑来“让编译通过”；先判断你能否真正处理这个异常。',
          },
        },
        {
          id: 'c6l1-s3',
          type: 'example',
          content: {
            scenarios: [
              {
                name: '场景 1：数字格式错误（非受检）',
                code: `public class ParseDemo {
    public static void main(String[] args) {
        String text = "12x";
        int value = Integer.parseInt(text);
        System.out.println(value);
    }
}`,
                output: 'Exception in thread "main" java.lang.NumberFormatException: For input string: "12x"',
                lineNotes: {
                  3: '输入文本并不是合法整数。',
                  4: '`Integer.parseInt` 解析失败，抛出 NumberFormatException。',
                  5: '异常未被捕获，main 终止，后面的 println 不会执行。',
                },
                takeaway: '**一般规则**：NumberFormatException 是 RuntimeException（非受检）；需要在解析前校验，或显式捕获。',
              },
              {
                name: '场景 2：受检异常必须声明',
                code: `public class SleepDemo {
    public static void main(String[] args) throws InterruptedException {
        System.out.println("before");
        Thread.sleep(10);
        System.out.println("after");
    }
}`,
                output: 'before\nafter',
                lineNotes: {
                  2: '`main` 声明 `throws InterruptedException`，把处理责任交给调用方（这里是 JVM）。',
                  4: '`Thread.sleep` 可能被中断，抛出受检的 InterruptedException。',
                  5: '正常休眠结束后继续执行。',
                },
                takeaway: '**一般规则**：受检异常必须在方法签名中声明，或在方法内 catch；不处理就无法通过编译。',
              },
            ],
          },
        },
        {
          id: 'c6l1-s4',
          type: 'quiz',
          content: {
            kind: 'choice',
            question: '下面哪一个是受检异常（checked exception）？',
            options: ['`NullPointerException`', '`NumberFormatException`', '`IOException`', '`ArithmeticException`'],
            answerIndex: 2,
            explanation:
              'IOException 直接继承 Exception，是受检异常；其余三个都继承 RuntimeException，是非受检异常。',
          },
        },
        {
          id: 'c6l1-s5',
          type: 'coding',
          content: {
            exerciseId: 'c6l1-parse',
            task: '读入一行文本，尝试解析为整数。成功输出整数，失败输出 `invalid`（不要打印堆栈）。',
            io: `输入：一行文本
输出：整数或 invalid
样例：输入 42 → 输出 42；输入 12x → 输出 invalid
约束：用 try-catch 处理 NumberFormatException。`,
            skeleton: `import java.util.Scanner;

public class Main {
    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);
        String text = scanner.nextLine();
        // 尝试解析
    }
}`,
            hints: [
              '概念回顾：`Integer.parseInt` 失败会抛 NumberFormatException。',
              '解题方向：把 parse 放进 try，catch 中输出 invalid。',
              '关键 API：`Integer.parseInt`、`catch (NumberFormatException e)`。',
            ],
            tests: [
              {
                label: '合法整数',
                kind: 'normal',
                stdin: '42\n',
                expectedStdout: '42\n',
              },
              {
                label: '带非法字符',
                kind: 'tricky',
                stdin: '12x\n',
                expectedStdout: 'invalid\n',
              },
              {
                label: '负整数',
                kind: 'edge',
                stdin: '-7\n',
                expectedStdout: '-7\n',
              },
            ],
            answer: `import java.util.Scanner;

public class Main {
    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);
        String text = scanner.nextLine();
        try {
            System.out.println(Integer.parseInt(text));
        } catch (NumberFormatException e) {
            System.out.println("invalid");
        }
    }
}`,
            answerWhy:
              'try 中执行可能失败的解析；catch 只处理 NumberFormatException，输出约定的 invalid，不把堆栈暴露给用户。',
          },
        },
        {
          id: 'c6l1-s6',
          type: 'summary',
          content: {
            points: [
              {
                kind: 'general',
                text: '**一般规则**：Throwable 分为 Error 与 Exception；Error 通常不捕获，Exception 才按业务处理。',
              },
              {
                kind: 'general',
                text: '**一般规则**：RuntimeException 是非受检异常，通常表示编程错误；其他 Exception 是受检异常。',
              },
              {
                kind: 'general',
                text: '**一般规则**：受检异常必须 catch 或在方法签名 throws；非受检异常不强制，但仍应通过校验避免。',
              },
              {
                kind: 'scenario',
                text: '数字解析展示非受检异常；sleep 展示受检异常的 throws 声明。',
              },
            ],
          },
        },
        {
          id: 'c6l1-s7',
          type: 'pitfall',
          content: {
            items: [
              {
                wrong: 'try { ... } catch (Exception e) { }',
                why: '空 catch 吞掉所有异常，包括你无法处理的类型，问题被隐藏。',
                right: '只捕获能处理的具体异常，并在 catch 中记录、恢复或重新抛出。',
              },
              {
                wrong: 'catch (OutOfMemoryError e) { System.out.println("继续"); }',
                why: 'Error 表示 JVM 资源或状态严重异常，继续执行通常不可靠。',
                right: '让 Error 向上传播，修复资源问题。',
              },
              {
                wrong: 'public void read() { Files.readString(...); }',
                why: 'IOException 是受检异常，没有 catch 也没有 throws，编译失败。',
                right: '在方法签名写 `throws IOException`，或在方法内处理。',
              },
            ],
          },
        },
      ],
    },
    {
      id: 'c6l2',
      chapter: 6,
      title: 'try-catch-finally 与 finally 的 return',
      summary: 'finally 在离开 try 时执行；try 或 catch 中的 return 不会跳过 finally，finally 里的 return 会覆盖前面的返回值。',
      steps: [
        {
          id: 'c6l2-s1',
          type: 'goal',
          content: {
            text: '你能排出 try / catch / finally 的执行顺序，使用多重 catch，并解释为什么不要在 finally 里 return。',
            checklist: ['知道 finally 总会执行', '会写 multi-catch', '知道 finally return 会覆盖结果'],
          },
        },
        {
          id: 'c6l2-s2',
          type: 'concept',
          content: {
            title: '离开 try 时，finally 一定执行',
            paragraphs: [
              '正常结束、抛出异常、执行 return、甚至 break / continue 离开 try，finally 都会执行。',
              '执行顺序：try 的剩余部分 → catch（匹配时）→ finally。',
              '多重捕获：`catch (IOException | SQLException e)` 用 `|` 合并处理逻辑相同的异常。',
              '如果 try 中 return，Java 会先保存返回值，执行 finally，再真正返回；finally 中再 return 会覆盖之前的结果。',
              '`System.exit` 是少数不会执行 finally 的情况；除此之外不要依赖“跳过 finally”。',
              'finally 适合释放资源、恢复状态，不适合写业务返回逻辑。',
            ],
            table: {
              headers: ['场景', 'catch 是否执行', 'finally 是否执行'],
              rows: [
                ['try 正常结束', '否', '是'],
                ['try 抛出匹配异常', '是', '是'],
                ['try 抛出未匹配异常', '否', '是'],
                ['try 中 return', '否', '是'],
                ['finally 中 return', '取决于之前', '是，并覆盖返回值'],
              ],
            },
            note: 'try-with-resources 是更安全的资源释放方式；普通 finally 仍适合非资源类的清理。',
          },
        },
        {
          id: 'c6l2-s3',
          type: 'example',
          content: {
            scenarios: [
              {
                name: '场景 1：捕获算术异常并清理',
                code: `public class DivDemo {
    public static void main(String[] args) {
        int a = 10;
        int b = 0;
        try {
            System.out.println(a / b);
        } catch (ArithmeticException e) {
            System.out.println("不能除以 0");
        } finally {
            System.out.println("done");
        }
    }
}`,
                output: '不能除以 0\ndone',
                lineNotes: {
                  6: '整数除以 0 抛 ArithmeticException。',
                  7: 'catch 匹配该异常，执行处理逻辑。',
                  9: 'finally 无论是否异常都会执行。',
                  10: '打印清理完成。',
                },
                takeaway: '**一般规则**：catch 处理可恢复的失败，finally 做必须执行的清理；两者职责分开。',
              },
              {
                name: '场景 2：finally 覆盖返回值',
                code: `public class FinallyReturn {
    static int value() {
        try {
            return 1;
        } finally {
            return 2;
        }
    }

    public static void main(String[] args) {
        System.out.println(value());
    }
}`,
                output: '2',
                lineNotes: {
                  4: 'try 准备返回 1。',
                  6: 'finally 在真正返回前执行，又 return 2。',
                  7: 'finally 的返回值覆盖 try 的返回值。',
                  11: '最终输出 2，而不是 1。',
                },
                takeaway: '**一般规则**：不要在 finally 中 return / throw；它会覆盖 try / catch 的结果，隐藏原始失败。',
              },
            ],
          },
        },
        {
          id: 'c6l2-s4',
          type: 'quiz',
          content: {
            kind: 'judge',
            statement: 'try 块中执行 `return` 之后，finally 块不会执行。',
            answer: false,
            explanation: 'return 只是准备离开方法；JVM 会先执行 finally，再完成返回。所以 finally 一定会执行（System.exit 等极端情况除外）。',
          },
        },
        {
          id: 'c6l2-s5',
          type: 'coding',
          content: {
            exerciseId: 'c6l2-divide',
            task: '读入两个整数，输出整除结果；如果除数为 0，输出 `error`。必须使用 try-catch。',
            io: `输入：两个整数（被除数、除数）
输出：整除结果或 error
样例：输入 6 3 → 输出 2；输入 1 0 → 输出 error
约束：不要提前用 if 判断除数，练习异常处理。`,
            skeleton: `import java.util.Scanner;

public class Main {
    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);
        int a = scanner.nextInt();
        int b = scanner.nextInt();
        // try-catch 处理除零
    }
}`,
            hints: [
              '概念回顾：整数除以 0 抛 ArithmeticException。',
              '解题方向：把 `a / b` 放进 try，catch 中输出 error。',
              '关键 API：`catch (ArithmeticException e)`。',
            ],
            tests: [
              {
                label: '正常整除',
                kind: 'normal',
                stdin: '6 3\n',
                expectedStdout: '2\n',
              },
              {
                label: '除数为 0',
                kind: 'tricky',
                stdin: '1 0\n',
                expectedStdout: 'error\n',
              },
              {
                label: '负被除数',
                kind: 'edge',
                stdin: '-6 3\n',
                expectedStdout: '-2\n',
              },
            ],
            answer: `import java.util.Scanner;

public class Main {
    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);
        int a = scanner.nextInt();
        int b = scanner.nextInt();
        try {
            System.out.println(a / b);
        } catch (ArithmeticException e) {
            System.out.println("error");
        }
    }
}`,
            answerWhy:
              '除零在运行时抛 ArithmeticException，catch 把它转换成业务约定的 error。先判断 b != 0 也能避免异常，但本题用于练习捕获路径。',
          },
        },
        {
          id: 'c6l2-s6',
          type: 'summary',
          content: {
            points: [
              {
                kind: 'general',
                text: '**一般规则**：finally 在离开 try 时一定执行；return、break、异常都不会跳过它。',
              },
              {
                kind: 'general',
                text: '**一般规则**：try 中 return 会先执行 finally；finally 中 return 会覆盖之前的结果。',
              },
              {
                kind: 'general',
                text: '**一般规则**：catch 只处理你理解的异常类型；多重 catch 用 `|` 合并相同处理。',
              },
              {
                kind: 'scenario',
                text: '除零示例展示 catch + finally；FinallyReturn 展示 finally 覆盖返回值的陷阱。',
              },
            ],
          },
        },
        {
          id: 'c6l2-s7',
          type: 'pitfall',
          content: {
            items: [
              {
                wrong: 'try { return 1; } finally { return 2; }',
                why: 'finally 的 return 覆盖 try 的返回值，调用方永远拿不到 1。',
                right: 'finally 只做清理，不要在里 return / throw。',
              },
              {
                wrong: 'catch (Exception e) { /* 什么都不做 */ }',
                why: '所有异常被静默吞掉，调用方以为成功，状态可能已经损坏。',
                right: '至少记录日志；不能处理的异常应继续抛出。',
              },
              {
                wrong: '在 finally 里关闭资源，但资源关闭本身又抛异常。',
                why: '会覆盖 try 中的原始异常，真正的失败原因丢失。',
                right: '资源实现 AutoCloseable，改用 try-with-resources。',
              },
            ],
          },
        },
      ],
    },
    {
      id: 'c6l3',
      chapter: 6,
      title: 'try-with-resources 与自定义异常',
      summary: '实现 AutoCloseable 的资源用 try-with-resources 自动关闭；自定义异常用于表达业务语义，并带上可读消息。',
      steps: [
        {
          id: 'c6l3-s1',
          type: 'goal',
          content: {
            text: '你能用 try-with-resources 安全关闭资源，定义受检或非受检的自定义异常，并在合适的层捕获它。',
            checklist: ['知道 try-with-resources 的关闭顺序', '会写自定义异常构造器', '知道 checked / unchecked 自定义异常的选择'],
          },
        },
        {
          id: 'c6l3-s2',
          type: 'concept',
          content: {
            title: '自动关闭与业务语义',
            paragraphs: [
              'try-with-resources 要求资源实现 `AutoCloseable`；无论正常结束还是异常，都会自动调用 close。',
              '多个资源按声明顺序打开、按相反顺序关闭；关闭时的异常会作为 suppressed 附加到主异常上，不会覆盖主异常。',
              '自定义异常通常继承 `Exception`（受检）或 `RuntimeException`（非受检）；构造器至少提供 message，必要时提供 cause。',
              '业务上“调用方可以合理恢复或必须处理”的失败，适合受检异常；编程错误或不可恢复的调用错误，适合非受检异常。',
              '处理策略：能在当前层恢复就 catch；不能处理就向上抛；跨层边界可包装成更有语义的异常，并保留 cause。',
              '与 Go 的 `error` 返回值相比，Java 异常会打断正常控制流；优点是调用链上的错误不会被悄悄忽略，代价是签名会显式列出受检异常。',
            ],
            table: {
              headers: ['做法', '适用场景', '注意'],
              rows: [
                ['`try-with-resources`', '文件、流、连接等资源', '资源必须 AutoCloseable'],
                ['自定义受检异常', '调用方应处理的业务失败', '方法签名要 throws'],
                ['自定义非受检异常', '编程错误 / 非法参数', '不要滥用为流程控制'],
                ['包装异常', '跨层转换语义', '保留 cause，避免丢失根因'],
              ],
            },
            note: '不要为了“看起来专业”给每个失败都造异常类；异常类型应该帮助调用方做出不同决策。',
          },
        },
        {
          id: 'c6l3-s3',
          type: 'example',
          content: {
            scenarios: [
              {
                name: '场景 1：try-with-resources 自动关闭',
                code: `import java.io.BufferedReader;
import java.io.IOException;
import java.io.StringReader;

public class ReadDemo {
    public static void main(String[] args) {
        try (BufferedReader reader =
                new BufferedReader(new StringReader("line1\\nline2"))) {
            System.out.println(reader.readLine());
        } catch (IOException e) {
            System.out.println("读取失败");
        }
    }
}`,
                output: 'line1',
                lineNotes: {
                  7: '资源在 try 的括号中声明；作用域结束时自动 close。',
                  8: 'StringReader 提供内存中的文本，BufferedReader 负责按行读取。',
                  9: '读取第一行；离开 try 后 BufferedReader 自动关闭。',
                  10: 'IOException 是受检异常，必须 catch 或声明。',
                },
                takeaway: '**一般规则**：实现 AutoCloseable 的资源优先用 try-with-resources；关闭顺序与异常抑制都由语言保证。',
              },
              {
                name: '场景 2：自定义业务异常',
                code: `class InsufficientBalanceException extends Exception {
    InsufficientBalanceException(String message) {
        super(message);
    }
}

class Account {
    private long balance;

    Account(long balance) {
        this.balance = balance;
    }

    void withdraw(long cents) throws InsufficientBalanceException {
        if (cents > balance) {
            throw new InsufficientBalanceException("余额不足");
        }
        balance -= cents;
    }

    long getBalance() {
        return balance;
    }
}

public class BankDemo {
    public static void main(String[] args) {
        Account account = new Account(1000);
        try {
            account.withdraw(1500);
        } catch (InsufficientBalanceException e) {
            System.out.println(e.getMessage());
        }
        System.out.println(account.getBalance());
    }
}`,
                output: '余额不足\n1000',
                lineNotes: {
                  1: '自定义异常继承 Exception，属于受检异常。',
                  3: '把业务消息传给父类构造器。',
                  14: '方法签名声明可能抛出该异常。',
                  16: '余额不足时抛出，带明确消息。',
                  29: '调用方必须处理受检异常。',
                  31: 'catch 后打印业务消息。',
                  34: '失败没有扣款，余额仍是 1000。',
                },
                takeaway: '**一般规则**：自定义异常应携带可读消息；受检异常把“必须处理”写进签名，调用方无法忽略。',
              },
            ],
          },
        },
        {
          id: 'c6l3-s4',
          type: 'quiz',
          content: {
            kind: 'choice',
            question: '关于 try-with-resources，哪一句正确？',
            options: [
              '资源不需要实现任何接口',
              '多个资源按声明顺序关闭',
              '资源会在 try 结束时自动关闭，关闭顺序与声明顺序相反',
              '它只能用于文件 IO',
            ],
            answerIndex: 2,
            explanation:
              '资源必须实现 AutoCloseable；多个资源按声明相反顺序关闭。它适用于所有 AutoCloseable，不只文件 IO。',
          },
        },
        {
          id: 'c6l3-s5',
          type: 'coding',
          content: {
            exerciseId: 'c6l3-age',
            task: '定义受检异常 `InvalidAgeException`；`checkAge(int age)` 在 age < 0 或 > 120 时抛出。读入年龄，合法输出 `ok`，非法输出异常消息 `invalid age`。',
            io: `输入：一个整数年龄
输出：ok 或 invalid age
样例：输入 20 → 输出 ok；输入 -1 → 输出 invalid age
约束：自定义异常必须继承 Exception，并在方法签名声明。`,
            skeleton: `import java.util.Scanner;

public class Main {
    static class InvalidAgeException extends Exception {
        InvalidAgeException(String message) {
            super(message);
        }
    }

    static void checkAge(int age) throws InvalidAgeException {
        // 非法时抛出异常
    }

    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);
        int age = scanner.nextInt();
        try {
            checkAge(age);
            System.out.println("ok");
        } catch (InvalidAgeException e) {
            System.out.println(e.getMessage());
        }
    }
}`,
            hints: [
              '概念回顾：受检异常必须 throws 或 catch；自定义异常至少提供 message。',
              '解题方向：checkAge 中判断边界，非法时 `throw new InvalidAgeException("invalid age")`。',
              '关键 API：`throw`、`extends Exception`、`throws`。',
            ],
            tests: [
              {
                label: '合法年龄',
                kind: 'normal',
                stdin: '20\n',
                expectedStdout: 'ok\n',
              },
              {
                label: '负数年龄',
                kind: 'tricky',
                stdin: '-1\n',
                expectedStdout: 'invalid age\n',
              },
              {
                label: '超过上限',
                kind: 'edge',
                stdin: '121\n',
                expectedStdout: 'invalid age\n',
              },
              {
                label: '边界值 120',
                kind: 'edge',
                stdin: '120\n',
                expectedStdout: 'ok\n',
              },
            ],
            answer: `import java.util.Scanner;

public class Main {
    static class InvalidAgeException extends Exception {
        InvalidAgeException(String message) {
            super(message);
        }
    }

    static void checkAge(int age) throws InvalidAgeException {
        if (age < 0 || age > 120) {
            throw new InvalidAgeException("invalid age");
        }
    }

    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);
        int age = scanner.nextInt();
        try {
            checkAge(age);
            System.out.println("ok");
        } catch (InvalidAgeException e) {
            System.out.println(e.getMessage());
        }
    }
}`,
            answerWhy:
              'checkAge 只负责校验并抛出带语义的异常；main 决定如何呈现失败。这样校验规则可以复用到其他调用方，而输出格式留在边界层。',
          },
        },
        {
          id: 'c6l3-s6',
          type: 'summary',
          content: {
            points: [
              {
                kind: 'general',
                text: '**一般规则**：AutoCloseable 资源用 try-with-resources，按声明相反顺序自动关闭。',
              },
              {
                kind: 'general',
                text: '**一般规则**：受检自定义异常继承 Exception，并在方法签名 throws；非受检继承 RuntimeException。',
              },
              {
                kind: 'general',
                text: '**一般规则**：异常携带 message / cause；跨层包装时保留根因，不要吞掉原始异常。',
              },
              {
                kind: 'scenario',
                text: 'BufferedReader 展示自动关闭；余额不足异常展示业务语义与调用方处理。',
              },
            ],
          },
        },
        {
          id: 'c6l3-s7',
          type: 'pitfall',
          content: {
            items: [
              {
                wrong: 'BufferedReader reader = new BufferedReader(...);\nreader.readLine();\n// 忘记 close',
                why: '异常路径下资源不会释放，文件句柄或连接会泄漏。',
                right: '用 try-with-resources 包裹资源声明。',
              },
              {
                wrong: 'throw new InsufficientBalanceException();  // 没有消息',
                why: '调用方只能看到类型，无法知道具体原因。',
                right: '构造器传入可读 message，必要时带上 cause。',
              },
              {
                wrong: 'catch (InvalidAgeException e) { }  // 静默忽略',
                why: '异常被吞掉，调用方以为校验通过。',
                right: '在当前层能处理就处理；不能处理就继续抛出。',
              },
            ],
          },
        },
      ],
    },
  ],
}
