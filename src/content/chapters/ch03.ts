import type { Chapter } from '../../types/content'

export const chapter03: Chapter = {
  id: 'chapter-3',
  number: 3,
  title: '面向对象基础',
  subtitle: '类与对象、构造器与 this、访问修饰符与封装、static 与包。先把“数据 + 行为”的组织方式建立起来。',
  lessons: [
    {
      id: 'c3l1',
      chapter: 3,
      title: '类与对象：字段、方法、构造器、this',
      summary: '类是模板，对象是实例；构造器负责初始化，this 指向当前对象，对象变量保存的是引用。',
      steps: [
        {
          id: 'c3l1-s1',
          type: 'goal',
          content: {
            text: '你能定义一个带字段、方法、构造器的类，用 new 创建对象，并解释 this 在参数与字段同名时的作用。',
            checklist: ['区分类与对象', '知道构造器没有返回类型', '会判断两个对象变量是否指向同一个对象'],
          },
        },
        {
          id: 'c3l1-s2',
          type: 'concept',
          content: {
            title: '类是模板，对象是实例',
            paragraphs: [
              '类描述“有哪些字段、能做哪些动作”；对象是依据这个模板创建出来的实例，每个实例有自己的字段副本。',
              '`new ClassName(...)` 分配一个对象并调用构造器，返回该对象的引用。对象变量保存的是引用，不是对象本身。',
              '字段表示状态，方法表示行为。实例方法可以直接访问本对象的字段。',
              '构造器与类同名、没有返回类型；`new` 时自动调用。没有手写任何构造器时，编译器提供一个无参默认构造器。',
              '`this` 指向当前对象。参数与字段同名时，必须用 `this.field = field` 区分。',
              'Java 没有指针运算；对象变量可以为 null，表示没有指向任何对象。对 null 调用方法会抛 `NullPointerException`。',
            ],
            table: {
              headers: ['概念', 'Java', 'Go / Python 对照'],
              rows: [
                ['定义类型', '`class`', 'Go `struct` + 方法；Python `class`'],
                ['创建实例', '`new ClassName(...)`', 'Go 结构体字面量；Python `ClassName(...)`'],
                ['当前实例', '`this`', 'Go 接收者；Python `self`'],
                ['空引用', '`null`', 'Go 零值 / nil 指针；Python `None`'],
              ],
            },
            note: '对象变量之间的赋值复制的是引用：两个变量可以指向同一个对象，通过任一变量修改字段，另一个变量都能看到。',
          },
        },
        {
          id: 'c3l1-s3',
          type: 'example',
          content: {
            scenarios: [
              {
                name: '场景 1：银行账户对象',
                code: `public class BankAccount {
    String owner;
    long balanceCents;

    BankAccount(String owner, long balanceCents) {
        this.owner = owner;
        this.balanceCents = balanceCents;
    }

    void deposit(long cents) {
        balanceCents += cents;
    }

    public static void main(String[] args) {
        BankAccount account = new BankAccount("Ada", 10000);
        account.deposit(2500);
        System.out.println(account.owner + ": " + account.balanceCents);
    }
}`,
                output: 'Ada: 12500',
                lineNotes: {
                  2: '字段 `owner` 保存户名；每个对象都有自己的这一份。',
                  3: '金额用 long 表示“分”，避免浮点误差。',
                  5: '构造器与类同名、没有返回类型。',
                  6: '参数名与字段名相同，`this.owner` 明确指向当前对象的字段。',
                  10: '实例方法直接读写本对象的 `balanceCents`。',
                  15: '`new` 创建对象并调用构造器，返回引用赋给 `account`。',
                  16: '通过引用调用方法；修改的是该对象自己的字段。',
                  17: '读取字段并输出最终结果。',
                },
                takeaway: '**一般规则**：字段存状态、方法改状态；构造器负责把对象初始化到合法状态。',
              },
              {
                name: '场景 2：两个矩形对象互不影响',
                code: `public class Rectangle {
    int width;
    int height;

    Rectangle(int width, int height) {
        this.width = width;
        this.height = height;
    }

    int area() {
        return width * height;
    }

    public static void main(String[] args) {
        Rectangle a = new Rectangle(3, 4);
        Rectangle b = new Rectangle(5, 2);
        System.out.println(a.area() + " " + b.area());
    }
}`,
                output: '12 10',
                lineNotes: {
                  2: '每个 Rectangle 对象都有自己的 width / height。',
                  7: '构造器把参数写入当前对象的字段。',
                  11: '`area()` 是实例方法，读取的是调用它的那个对象的字段。',
                  15: '第一个对象：3×4。',
                  16: '第二个对象：5×2；它与 a 完全独立。',
                  17: '同一个方法定义，作用在不同对象上得到不同结果。',
                },
                takeaway: '**一般规则**：方法定义只有一份，字段每个实例一份；方法的结果取决于调用它的对象。',
              },
            ],
          },
        },
        {
          id: 'c3l1-s4',
          type: 'quiz',
          content: {
            kind: 'choice',
            question: '下面哪个构造器声明是合法的？',
            options: ['`void BankAccount() {}`', '`BankAccount() {}`', '`static BankAccount() {}`', '`BankAccount(int x) { return x; }`'],
            answerIndex: 1,
            explanation: '构造器与类同名，没有返回类型（连 void 也不能写），也不能是 static。写返回类型就变成普通方法了。',
          },
        },
        {
          id: 'c3l1-s5',
          type: 'coding',
          content: {
            exerciseId: 'c3l1-box',
            task: '实现 `Box` 类：三个 int 字段、接收三个参数的构造器、返回体积的 `volume()`。在 main 中读入长宽高并输出体积。',
            io: `输入：三个整数（长 宽 高）
输出：体积
样例：输入 2 3 4 → 输出 24
约束：允许 0；结果在 int 范围内。`,
            skeleton: `import java.util.Scanner;

public class Main {
    static class Box {
        int length;
        int width;
        int height;

        Box(int length, int width, int height) {
            // 用 this 初始化字段
        }

        int volume() {
            // 返回体积
            return 0;
        }
    }

    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);
        Box box = new Box(scanner.nextInt(), scanner.nextInt(), scanner.nextInt());
        System.out.println(box.volume());
    }
}`,
            hints: [
              '概念回顾：构造器负责初始化字段；`this.field = field` 用来区分同名参数。',
              '解题方向：构造器里给三个字段赋值；`volume()` 返回三者乘积。',
              '关键 API：不需要额外 API，直接用字段乘法。',
            ],
            tests: [
              {
                label: '普通长方体',
                kind: 'normal',
                stdin: '2 3 4\n',
                expectedStdout: '24\n',
              },
              {
                label: '单位立方体',
                kind: 'edge',
                stdin: '1 1 1\n',
                expectedStdout: '1\n',
              },
              {
                label: '有一边为 0',
                kind: 'tricky',
                stdin: '0 5 5\n',
                expectedStdout: '0\n',
              },
            ],
            answer: `import java.util.Scanner;

public class Main {
    static class Box {
        int length;
        int width;
        int height;

        Box(int length, int width, int height) {
            this.length = length;
            this.width = width;
            this.height = height;
        }

        int volume() {
            return length * width * height;
        }
    }

    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);
        Box box = new Box(scanner.nextInt(), scanner.nextInt(), scanner.nextInt());
        System.out.println(box.volume());
    }
}`,
            answerWhy:
              '构造器把三个参数写进当前对象的字段，`volume()` 读取的也是同一对象的字段。用 this 区分同名参数，避免把参数赋给参数自己。',
          },
        },
        {
          id: 'c3l1-s6',
          type: 'summary',
          content: {
            points: [
              {
                kind: 'general',
                text: '**一般规则**：类定义模板，对象是实例；字段每个实例一份，方法定义共享一份。',
              },
              {
                kind: 'general',
                text: '**一般规则**：构造器与类同名且没有返回类型；`new` 分配对象并调用构造器。',
              },
              {
                kind: 'general',
                text: '**一般规则**：参数与字段同名时用 `this.field = parameter`；对象变量保存引用，null 调用方法会抛 NPE。',
              },
              {
                kind: 'scenario',
                text: '银行账户展示状态修改；两个矩形展示实例字段彼此独立。',
              },
            ],
          },
        },
        {
          id: 'c3l1-s7',
          type: 'pitfall',
          content: {
            items: [
              {
                wrong: 'BankAccount account;\naccount.deposit(100);',
                why: '只声明了引用，没有用 new 创建对象；account 为 null。',
                right: 'BankAccount account = new BankAccount(...); 再调用方法。',
              },
              {
                wrong: 'void BankAccount(int x) { ... }',
                why: '构造器不能写返回类型；这会被当成一个普通方法，导致 new 时找不到构造器。',
                right: 'BankAccount(int x) { ... }',
              },
              {
                wrong: 'BankAccount(String owner) {\n    owner = owner;\n}',
                why: '参数与字段同名，`owner = owner` 是参数自赋值，字段仍是默认值 null。',
                right: 'this.owner = owner;',
              },
            ],
          },
        },
      ],
    },
    {
      id: 'c3l2',
      chapter: 3,
      title: '访问修饰符与封装',
      summary: '用 private 隐藏字段、用 public 方法维护规则；访问级别决定谁能看到成员。',
      steps: [
        {
          id: 'c3l2-s1',
          type: 'goal',
          content: {
            text: '你能写出四种访问级别的适用范围，把一个暴露字段的类重构成封装良好的类，并在方法里守住对象的不变量。',
            checklist: ['记住四种访问级别的作用范围', '知道 default 不是 public', '会把校验放进 setter / 构造器'],
          },
        },
        {
          id: 'c3l2-s2',
          type: 'concept',
          content: {
            title: '四种访问级别',
            paragraphs: [
              '`private`：只在当前类内可见。字段通常设为 private。',
              '默认（不写修饰符，也叫 package-private）：同一个包内可见，包外不可见。',
              '`protected`：同一个包内可见；不同包的子类也能访问（受继承规则限制）。',
              '`public`：任何地方可见。对外 API 才用 public，不要把所有成员都标成 public。',
              '**封装**不是“加一个 getter 就完事”，而是让外部只能通过你允许的方法改变状态，并在方法里维护不变量，例如余额不能为负、温度不能低于绝对零度。',
            ],
            table: {
              headers: ['修饰符', '同一个类', '同一个包', '不同包子类', '任何位置'],
              rows: [
                ['`private`', '是', '否', '否', '否'],
                ['默认', '是', '是', '否', '否'],
                ['`protected`', '是', '是', '是', '否'],
                ['`public`', '是', '是', '是', '是'],
              ],
            },
            note: '本课程的执行服务拒绝带 package 声明的代码；“同一个包”的行为可以在概念上理解，练习里只写默认包。',
          },
        },
        {
          id: 'c3l2-s3',
          type: 'example',
          content: {
            scenarios: [
              {
                name: '场景 1：余额只能通过受控方法变化',
                code: `public class SafeAccount {
    private long balanceCents;

    SafeAccount(long balanceCents) {
        if (balanceCents < 0) {
            throw new IllegalArgumentException("余额不能为负");
        }
        this.balanceCents = balanceCents;
    }

    public void deposit(long cents) {
        if (cents <= 0) {
            return;
        }
        balanceCents += cents;
    }

    public long getBalanceCents() {
        return balanceCents;
    }

    public static void main(String[] args) {
        SafeAccount account = new SafeAccount(1000);
        account.deposit(500);
        account.deposit(-200);
        System.out.println(account.getBalanceCents());
    }
}`,
                output: '1500',
                lineNotes: {
                  2: '余额是 private，外部不能直接改。',
                  5: '构造器先校验，再写入字段；对象创建后余额一定非负。',
                  11: '存款方法自己判断参数合法性。',
                  12: '非正数直接返回，外部无法用“存负数”减少余额。',
                  18: '只读取余额，不提供直接设置余额的方法。',
                  24: '存 500 成功。',
                  25: '存 -200 被忽略。',
                  26: '最终余额 1500。',
                },
                takeaway: '**一般规则**：字段 private，修改入口 public；把校验放在入口里，保证任何调用路径都不会破坏不变量。',
              },
              {
                name: '场景 2：温度设置器的边界',
                code: `public class Temperature {
    private double celsius;

    Temperature(double celsius) {
        this.celsius = celsius;
    }

    public void setCelsius(double value) {
        if (value < -273.15) {
            return;
        }
        celsius = value;
    }

    public double getCelsius() {
        return celsius;
    }

    public static void main(String[] args) {
        Temperature t = new Temperature(20);
        t.setCelsius(-300);
        System.out.println(t.getCelsius());
    }
}`,
                output: '20.0',
                lineNotes: {
                  2: '温度字段 private，外部只能通过方法修改。',
                  9: 'setter 拒绝低于绝对零度的值。',
                  12: '合法值才写入字段。',
                  21: '非法赋值被忽略，温度仍是 20。',
                },
                takeaway: '**一般规则**：setter 不只是赋值；它是对外修改状态的关卡，应该在这里拒绝非法值。',
              },
            ],
          },
        },
        {
          id: 'c3l2-s4',
          type: 'quiz',
          content: {
            kind: 'choice',
            question: '希望一个字段只能在当前类内部访问，应使用哪个修饰符？',
            options: ['`public`', '`protected`', '默认（不写）', '`private`'],
            answerIndex: 3,
            explanation: 'private 仅当前类可见。默认是同包可见，protected 还允许不同包的子类访问，public 处处可见。',
          },
        },
        {
          id: 'c3l2-s5',
          type: 'coding',
          content: {
            exerciseId: 'c3l2-account',
            task: '实现 `Account` 类：private 余额字段、构造器、只接受正数的 `deposit`、`getBalance`。读入初始余额和存款额，输出最终余额。',
            io: `输入：两个整数（初始余额、存款额）
输出：最终余额
样例：输入 100 50 → 输出 150
约束：存款额 ≤ 0 时不改变余额；余额用 long。`,
            skeleton: `import java.util.Scanner;

public class Main {
    static class Account {
        private long balance;

        Account(long balance) {
            this.balance = balance;
        }

        void deposit(long amount) {
            // 只接受正数
        }

        long getBalance() {
            return balance;
        }
    }

    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);
        Account account = new Account(scanner.nextLong());
        account.deposit(scanner.nextLong());
        System.out.println(account.getBalance());
    }
}`,
            hints: [
              '概念回顾：封装是把字段设为 private，并用方法维护合法状态。',
              '解题方向：deposit 里先判断 amount > 0，再累加；否则直接返回。',
              '关键 API：不需要额外 API。',
            ],
            tests: [
              {
                label: '正常存款',
                kind: 'normal',
                stdin: '100 50\n',
                expectedStdout: '150\n',
              },
              {
                label: '初始余额为 0',
                kind: 'edge',
                stdin: '0 10\n',
                expectedStdout: '10\n',
              },
              {
                label: '存负数被拒绝',
                kind: 'tricky',
                stdin: '100 -20\n',
                expectedStdout: '100\n',
              },
            ],
            answer: `import java.util.Scanner;

public class Main {
    static class Account {
        private long balance;

        Account(long balance) {
            this.balance = balance;
        }

        void deposit(long amount) {
            if (amount <= 0) {
                return;
            }
            balance += amount;
        }

        long getBalance() {
            return balance;
        }
    }

    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);
        Account account = new Account(scanner.nextLong());
        account.deposit(scanner.nextLong());
        System.out.println(account.getBalance());
    }
}`,
            answerWhy:
              '字段 private 阻止外部直接写余额；deposit 是唯一入口，正数才累加。这样“余额不会被负数减少”成为类的规则，而不是调用者的自觉。',
          },
        },
        {
          id: 'c3l2-s6',
          type: 'summary',
          content: {
            points: [
              {
                kind: 'general',
                text: '**一般规则**：字段 private、行为 public；对外只暴露必要操作，不暴露内部表示。',
              },
              {
                kind: 'general',
                text: '**一般规则**：访问级别按“类 → 包 → 子类 → 全局”逐层放宽；默认级别不是 public。',
              },
              {
                kind: 'general',
                text: '**一般规则**：setter / 构造器是状态入口，校验应放在这里，保证对象在任何时刻都满足不变量。',
              },
              {
                kind: 'scenario',
                text: '账户拒绝负数存款、温度拒绝低于绝对零度，都是把业务规则放进入口的例子。',
              },
            ],
          },
        },
        {
          id: 'c3l2-s7',
          type: 'pitfall',
          content: {
            items: [
              {
                wrong: 'public long balance;',
                why: '任何代码都能把余额改成负数，类无法维护自己的规则。',
                right: 'private long balance; 通过 deposit / getBalance 受控访问。',
              },
              {
                wrong: 'public void setBalance(long value) {\n    this.balance = value;\n}',
                why: '这只是把 public 字段换成了 public 方法，仍然没有校验，封装没有实际意义。',
                right: '提供语义明确的方法（deposit / withdraw），在方法里校验。',
              },
              {
                wrong: '以为不写修饰符就是 private。',
                why: '不写修饰符是包级可见（package-private），同包的其他类仍然能访问。',
                right: '要隐藏就显式写 private。',
              },
            ],
          },
        },
      ],
    },
    {
      id: 'c3l3',
      chapter: 3,
      title: 'static、静态块与类加载顺序',
      summary: 'static 成员属于类而不是对象；静态块在类初始化时执行一次，实例初始化在每次 new 时执行。',
      steps: [
        {
          id: 'c3l3-s1',
          type: 'goal',
          content: {
            text: '你能区分静态成员与实例成员，写出静态计数器，并解释类初始化与对象初始化的执行顺序。',
            checklist: ['知道 static 字段只有一份', '知道静态方法没有 this', '能排出静态块 / 实例块 / 构造器的顺序'],
          },
        },
        {
          id: 'c3l3-s2',
          type: 'concept',
          content: {
            title: '属于类，还是属于对象',
            paragraphs: [
              '`static` 字段属于类，所有实例共享同一份；实例字段属于对象，每个对象各有一份。',
              '`static` 方法属于类，没有 `this`，不能直接访问实例字段；`Math.max` 这类工具方法就是静态方法。',
              '**静态初始化块** `static { ... }` 在类第一次被初始化时执行一次；多个静态字段与静态块按源码顺序执行。',
              '**实例初始化**：每次 `new` 时，先执行实例字段初始化与实例块，再执行构造器。',
              '类初始化的触发包括：创建实例、访问静态字段、调用静态方法。静态状态是全局的，修改它要谨慎。',
            ],
            table: {
              headers: ['成员', '归属', '每个对象一份？', '能否使用 this'],
              rows: [
                ['实例字段', '对象', '是', '可以'],
                ['静态字段', '类', '否（全类共享）', '不能'],
                ['实例方法', '对象', '方法代码共享，但绑定对象', '可以'],
                ['静态方法', '类', '否', '不能'],
              ],
            },
            note: '静态块适合初始化类级别的常量或资源；不要用它做依赖对象状态的事情。',
          },
        },
        {
          id: 'c3l3-s3',
          type: 'example',
          content: {
            scenarios: [
              {
                name: '场景 1：静态 ID 生成器',
                code: `public class IdGenerator {
    private static int nextId = 1;

    static {
        System.out.println("类已加载");
    }

    static int next() {
        return nextId++;
    }

    public static void main(String[] args) {
        System.out.println(next());
        System.out.println(next());
    }
}`,
                output: '类已加载\n1\n2',
                lineNotes: {
                  2: '静态字段属于类，只有一份，所有调用共享。',
                  5: '静态块在类初始化时执行一次。',
                  8: '静态方法没有 this，只能访问静态成员。',
                  9: '先返回当前值，再自增。',
                  13: '第一次调用拿到 1。',
                  14: '第二次拿到 2；状态在两次调用之间保留。',
                },
                takeaway: '**一般规则**：需要全类共享的计数或配置用 static；静态方法只依赖参数与静态状态。',
              },
              {
                name: '场景 2：初始化顺序',
                code: `public class InitOrder {
    static int staticValue = print("static field");

    int instanceValue = print("instance field");

    static {
        print("static block");
    }

    {
        print("instance block");
    }

    InitOrder() {
        print("constructor");
    }

    static int print(String label) {
        System.out.println(label);
        return 0;
    }

    public static void main(String[] args) {
        print("main before new");
        new InitOrder();
    }
}`,
                output: 'static field\nstatic block\nmain before new\ninstance field\ninstance block\nconstructor',
                lineNotes: {
                  2: '静态字段初始化最先执行，并且按源码顺序。',
                  6: '静态块紧跟在静态字段之后执行。',
                  10: '实例块不会在类加载时执行，只在 new 时执行。',
                  14: '构造器最后执行。',
                  23: 'main 是静态方法，但它在类初始化完成后才被调用。',
                  24: '先打印，再创建对象。',
                  25: 'new 触发实例字段 → 实例块 → 构造器。',
                },
                takeaway: '**一般规则**：类初始化只做一次（静态字段与静态块）；每次 new 都重新执行实例字段、实例块、构造器。',
              },
            ],
          },
        },
        {
          id: 'c3l3-s4',
          type: 'quiz',
          content: {
            kind: 'judge',
            statement: '静态方法可以直接访问同一个类的实例字段。',
            answer: false,
            explanation: '静态方法没有 this，不知道要访问哪一个对象的实例字段。必须先获得对象引用，再通过引用访问。',
          },
        },
        {
          id: 'c3l3-s5',
          type: 'coding',
          content: {
            exerciseId: 'c3l3-count',
            task: '实现 `Item` 类：静态字段 `count`，构造器每创建一个对象就让 count 加 1。读入 n，创建 n 个 Item，输出 count。',
            io: `输入：一个非负整数 n
输出：创建的 Item 数量
样例：输入 3 → 输出 3
约束：n ≥ 0；计数用 static 字段。`,
            skeleton: `import java.util.Scanner;

public class Main {
    static class Item {
        static int count = 0;

        Item() {
            // 每创建一个对象，count 加 1
        }
    }

    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);
        int n = scanner.nextInt();
        for (int i = 0; i < n; i++) {
            new Item();
        }
        System.out.println(Item.count);
    }
}`,
            hints: [
              '概念回顾：static 字段属于类，所有实例共享同一份。',
              '解题方向：构造器里写 `count++`；主方法只负责创建 n 个对象。',
              '关键 API：`Item.count` 直接用类名访问。',
            ],
            tests: [
              {
                label: '创建三个对象',
                kind: 'normal',
                stdin: '3\n',
                expectedStdout: '3\n',
              },
              {
                label: '一个也不创建',
                kind: 'edge',
                stdin: '0\n',
                expectedStdout: '0\n',
              },
              {
                label: '只创建一个',
                kind: 'tricky',
                stdin: '1\n',
                expectedStdout: '1\n',
              },
            ],
            answer: `import java.util.Scanner;

public class Main {
    static class Item {
        static int count = 0;

        Item() {
            count++;
        }
    }

    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);
        int n = scanner.nextInt();
        for (int i = 0; i < n; i++) {
            new Item();
        }
        System.out.println(Item.count);
    }
}`,
            answerWhy:
              'count 是 static 字段，所有 Item 对象共享同一份。构造器每执行一次就加 1，所以创建 n 个对象后 count 等于 n。若把 count 写成实例字段，每个对象各有一份，结果永远是 1。',
          },
        },
        {
          id: 'c3l3-s6',
          type: 'summary',
          content: {
            points: [
              {
                kind: 'general',
                text: '**一般规则**：需要全类共享的状态用 static；每个对象独立的状态用实例字段。',
              },
              {
                kind: 'general',
                text: '**一般规则**：静态方法没有 this，不能直接访问实例成员；工具方法适合 static。',
              },
              {
                kind: 'general',
                text: '**一般规则**：静态字段与静态块按源码顺序执行一次；实例字段、实例块、构造器每次 new 都执行。',
              },
              {
                kind: 'scenario',
                text: 'ID 生成器展示共享计数；初始化顺序示例展示类初始化与对象初始化的分界。',
              },
            ],
          },
        },
        {
          id: 'c3l3-s7',
          type: 'pitfall',
          content: {
            items: [
              {
                wrong: 'static int count = 0;\nint id = count++;',
                why: '把共享计数写进实例字段后，每个对象各有一份，无法统计总数。',
                right: '统计对象数量用 static 字段，并在构造器里自增。',
              },
              {
                wrong: 'static void printBalance() {\n    System.out.println(balance);\n}',
                why: '静态方法没有 this，balance 是实例字段，编译错误。',
                right: '把方法改为实例方法，或把对象作为参数传入。',
              },
              {
                wrong: 'static { config = loadFromDatabase(); }',
                why: '静态块在类初始化时执行，失败会影响整个类；它也不该依赖对象状态。',
                right: '静态块只做轻量、确定性的初始化；运行时配置放到显式方法里。',
              },
            ],
          },
        },
      ],
    },
    {
      id: 'c3l4',
      chapter: 3,
      title: '包与 import：类的组织方式',
      summary: 'package 是命名空间与目录结构，import 只引入简单名；java.lang 自动可用，同包类不需要 import。',
      steps: [
        {
          id: 'c3l4-s1',
          type: 'goal',
          content: {
            text: '你能解释 package 与目录的关系、import 的三种形式，并把相关类放进合适的包中。',
            checklist: ['知道 package 声明必须在文件第一行', '区分单类型 import 与按需 import', '知道 java.lang 不需要 import'],
          },
        },
        {
          id: 'c3l4-s2',
          type: 'concept',
          content: {
            title: '命名空间与可见性',
            paragraphs: [
              '`package com.example.shop;` 声明当前类所属的包；包名通常与目录结构对应，例如文件位于 `com/example/shop/Cart.java`。',
              '`import java.util.ArrayList;` 引入一个类的简单名；`import java.util.*;` 按需引入该包中的类型（不递归子包）。',
              '同一个包内的类互相访问不需要 import；`java.lang` 包（String、Math、System 等）自动导入。',
              '不写 package 的类属于默认包。默认包不能从有包名的类中导入，正式项目应避免使用。',
              '包还决定默认访问级别的范围：同一个包内可见，包外不可见。',
              '与 Go 的 package、Python 的 module 类似，Java 的包也是命名空间；但 Java 的目录结构与包名强绑定。',
            ],
            table: {
              headers: ['语言', '组织单位', '导入方式', '可见性默认'],
              rows: [
                ['Java', 'package + class', '`import`', '包级（默认修饰符）'],
                ['Go', 'package', '同一包直接引用；跨包用导入路径', '首字母大小写决定导出'],
                ['Python', 'module / package', '`import` / `from ... import`', '下划线约定，非强制'],
              ],
            },
            note: '执行服务拒绝带 package 的代码；练习题只写默认包。包的组织方式在真实项目中才启用。',
          },
        },
        {
          id: 'c3l4-s3',
          type: 'example',
          content: {
            scenarios: [
              {
                name: '场景 1：import 集合类型',
                code: `import java.util.ArrayList;
import java.util.List;

public class ImportDemo {
    public static void main(String[] args) {
        List<String> names = new ArrayList<>();
        names.add("Ada");
        names.add("Bob");
        System.out.println(names);
    }
}`,
                output: '[Ada, Bob]',
                lineNotes: {
                  1: '引入 ArrayList 的简单名；不写 import 就必须写全限定名。',
                  2: 'List 是接口，ArrayList 是它的一个实现。',
                  4: 'String 和 System 来自 java.lang，不需要 import。',
                  6: '声明接口类型、创建实现类对象，是常见的集合写法。',
                  9: 'println 调用 ArrayList 的 toString，输出方括号形式。',
                },
                takeaway: '**一般规则**：import 只影响你写类型名的方式；同一个简单名冲突时，用全限定名或只 import 一个。',
              },
              {
                name: '场景 2：package 与同包类',
                code: `package com.example.shop;

import java.util.ArrayList;
import java.util.List;

class Cart {
    private final List<String> items = new ArrayList<>();

    void add(String item) {
        items.add(item);
    }

    List<String> items() {
        return items;
    }
}

public class ShopApp {
    public static void main(String[] args) {
        Cart cart = new Cart();
        cart.add("书");
        cart.add("笔");
        System.out.println(cart.items());
    }
}`,
                output: '[书, 笔]',
                lineNotes: {
                  1: '包声明必须是文件第一条非注释语句；文件应位于 com/example/shop 目录。',
                  3: '只 import 用到的类型，不用导入同包的 Cart。',
                  6: 'Cart 是包级类，没有 public；同包的 ShopApp 仍能使用它。',
                  18: '一个文件只能有一个 public 类，文件名必须是 ShopApp.java。',
                  20: '同包类直接按简单名使用。',
                },
                takeaway: '**一般规则**：包名对应目录；同包类无需 import；一个文件最多一个 public 类，文件名与它一致。',
              },
            ],
          },
        },
        {
          id: 'c3l4-s4',
          type: 'quiz',
          content: {
            kind: 'choice',
            question: '在默认包（没有 package 声明）的类里使用 `ArrayList`，至少需要做什么？',
            options: ['什么都不用做', '`import java.util.ArrayList;`', '`package java.util;`', '把类改名为 ArrayList'],
            answerIndex: 1,
            explanation: 'ArrayList 不在 java.lang 中，必须 import（或用全限定名 java.util.ArrayList）。package 声明的是当前类所在的包，不是在导入别人的包。',
          },
        },
        {
          id: 'c3l4-s5',
          type: 'coding',
          content: {
            exerciseId: 'c3l4-list',
            task: '读入 n 和 n 个单词，用 ArrayList 按输入顺序保存，输出列表的 toString 形式。',
            io: `输入：第一行 n，随后在同一行给出 n 个单词（空白分隔）
输出：形如 [a, b, c]
样例：输入 "3 book pen cup" → 输出 [book, pen, cup]
约束：n ≥ 0；保留重复单词与输入顺序。`,
            skeleton: `import java.util.ArrayList;
import java.util.List;
import java.util.Scanner;

public class Main {
    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);
        int n = scanner.nextInt();
        List<String> words = new ArrayList<>();
        // 读入 n 个单词并加入列表
        System.out.println(words);
    }
}`,
            hints: [
              '概念回顾：ArrayList 是 List 的常用实现，add 追加到末尾。',
              '解题方向：循环 n 次，用 `scanner.next()` 读取每个单词并 add。',
              '关键 API：`List.add`；`ArrayList.toString` 自带方括号格式。',
            ],
            tests: [
              {
                label: '三个单词',
                kind: 'normal',
                stdin: '3 book pen cup\n',
                expectedStdout: '[book, pen, cup]\n',
              },
              {
                label: '一个单词',
                kind: 'edge',
                stdin: '1 solo\n',
                expectedStdout: '[solo]\n',
              },
              {
                label: '空列表',
                kind: 'edge',
                stdin: '0\n',
                expectedStdout: '[]\n',
              },
              {
                label: '重复单词保留',
                kind: 'tricky',
                stdin: '2 dup dup\n',
                expectedStdout: '[dup, dup]\n',
              },
            ],
            answer: `import java.util.ArrayList;
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
        System.out.println(words);
    }
}`,
            answerWhy:
              'ArrayList 保留插入顺序并允许重复，所以直接按输入顺序 add 即可。`toString` 已经生成 `[a, b]` 形式，不需要手动拼方括号。',
          },
        },
        {
          id: 'c3l4-s6',
          type: 'summary',
          content: {
            points: [
              {
                kind: 'general',
                text: '**一般规则**：package 声明命名空间并要求目录对应；一个文件最多一个 public 类，文件名与 public 类一致。',
              },
              {
                kind: 'general',
                text: '**一般规则**：import 引入类型简单名；java.lang 自动导入，同包类无需 import。',
              },
              {
                kind: 'general',
                text: '**一般规则**：默认访问级别是同包可见；包结构会影响谁能访问哪些类。',
              },
              {
                kind: 'scenario',
                text: '集合导入展示单类型 import；ShopApp / Cart 展示包内协作与 public 类规则。',
              },
            ],
          },
        },
        {
          id: 'c3l4-s7',
          type: 'pitfall',
          content: {
            items: [
              {
                wrong: 'import java.util.ArrayList;\npackage com.example;',
                why: 'package 声明必须在文件最前面（注释除外），import 不能在它之前。',
                right: '先写 package，再写 import。',
              },
              {
                wrong: 'import java.util.*;\nimport java.sql.*;',
                why: '两个按需导入都包含 Date 等简单名时会产生歧义，编译器会报错。',
                right: '只 import 真正使用的具体类型，或使用全限定名。',
              },
              {
                wrong: '把工具类放在默认包，供有包名的业务类 import。',
                why: '有包名的类无法导入默认包中的类型。',
                right: '工具类也声明包名，放进项目统一的包结构中。',
              },
            ],
          },
        },
      ],
    },
  ],
}
