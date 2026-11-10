import type { Chapter } from '../../types/content'

export const chapter04: Chapter = {
  id: 'chapter-4',
  number: 4,
  title: '继承与多态',
  subtitle: 'extends、super、重写与重载、动态分派、抽象类与接口。这是 OOP 的主干，也是 Java 设计中最常考的部分。',
  lessons: [
    {
      id: 'c4l1',
      chapter: 4,
      title: '继承：extends、super 与构造器调用链',
      summary: '子类通过 extends 复用父类；构造器不继承，必须先完成父类初始化，super() 必须是构造器第一条语句。',
      steps: [
        {
          id: 'c4l1-s1',
          type: 'goal',
          content: {
            text: '你能写出继承关系，解释构造器调用链，并在父类没有无参构造器时写出正确的 super(...) 调用。',
            checklist: ['知道构造器不会被继承', '知道 super() 必须第一条', '能排出父类 / 子类初始化顺序'],
          },
        },
        {
          id: 'c4l1-s2',
          type: 'concept',
          content: {
            title: 'is-a 关系与构造器链',
            paragraphs: [
              '`class Dog extends Animal` 表示 Dog **是一种** Animal；子类获得父类中可访问的字段与方法。',
              '构造器**不会**被继承。创建子类对象时，必须先初始化父类部分：子类构造器会调用父类构造器。',
              '`super(...)` 调用父类构造器，`super.method()` 调用父类版本的方法。`super(...)` 必须是子类构造器的第一条语句。',
              '如果子类构造器没有显式写 `super(...)`，编译器会插入无参的 `super();`。父类没有无参构造器时，这会编译失败。',
              '创建对象的执行顺序：父类字段与初始化块 → 父类构造器 → 子类字段与初始化块 → 子类构造器。',
              '与 Go 不同，Go 用结构体嵌入做组合复用，没有继承；Java 的 extends 是真正的类型继承，子类对象可以被父类引用指向。',
            ],
            table: {
              headers: ['概念', 'Java', 'Go 对照'],
              rows: [
                ['复用父类', '`extends`', '结构体嵌入 / 组合'],
                ['父类初始化', '`super(...)`', '在构造函数里显式初始化嵌入字段'],
                ['类型关系', '子类 is-a 父类', '没有继承层次'],
                ['方法复用', '继承 + 重写', '嵌入字段的方法提升'],
              ],
            },
            note: '私有成员也会存在于父类部分中，但子类不能直接访问；它们只能通过父类提供的公开方法使用。',
          },
        },
        {
          id: 'c4l1-s3',
          type: 'example',
          content: {
            scenarios: [
              {
                name: '场景 1：构造器链的执行顺序',
                code: `class Animal {
    Animal() {
        System.out.println("Animal");
    }
}

class Dog extends Animal {
    Dog() {
        super();
        System.out.println("Dog");
    }
}

public class Chain {
    public static void main(String[] args) {
        new Dog();
    }
}`,
                output: 'Animal\nDog',
                lineNotes: {
                  1: '父类 Animal 有一个无参构造器。',
                  7: 'Dog 继承 Animal；Dog 的构造器必须先完成 Animal 的初始化。',
                  9: '显式调用父类无参构造器；即使不写，编译器也会插入 super()。',
                  10: '父类初始化完成后，才执行子类构造器自己的语句。',
                  16: '创建 Dog 对象会依次执行 Animal → Dog 的构造器。',
                },
                takeaway: '**一般规则**：构造器沿继承链自顶向下执行；子类构造器必须先保证父类部分已经初始化。',
              },
              {
                name: '场景 2：父类没有无参构造器',
                code: `class Employee {
    String name;

    Employee(String name) {
        this.name = name;
        System.out.println("Employee: " + name);
    }
}

class Manager extends Employee {
    String department;

    Manager(String name, String department) {
        super(name);
        this.department = department;
        System.out.println("Manager: " + department);
    }
}

public class Org {
    public static void main(String[] args) {
        Manager manager = new Manager("Ada", "研发");
        System.out.println(manager.name + " / " + manager.department);
    }
}`,
                output: 'Employee: Ada\nManager: 研发\nAda / 研发',
                lineNotes: {
                  4: 'Employee 只定义了带参数的构造器，没有无参构造器。',
                  13: 'Manager 必须显式调用 `super(name)`，否则编译器插入的 `super()` 找不到匹配构造器。',
                  14: 'super 必须是构造器第一条语句；它先初始化 name。',
                  15: '父类部分完成后再初始化子类字段。',
                  22: '创建 Manager 时先执行 Employee 构造器，再执行 Manager 构造器。',
                  23: '子类对象也包含父类的 name 字段，可以直接访问。',
                },
                takeaway: '**一般规则**：父类没有无参构造器时，子类构造器必须显式 `super(参数)`，且放在第一条。',
              },
            ],
          },
        },
        {
          id: 'c4l1-s4',
          type: 'quiz',
          content: {
            kind: 'judge',
            statement: '子类会继承父类的构造器，因此可以用 `new Dog("名字")` 直接调用父类的构造器。',
            answer: false,
            explanation: '构造器不会被继承。子类只能定义自己的构造器，并在其中通过 super(...) 调用父类构造器。',
          },
        },
        {
          id: 'c4l1-s5',
          type: 'coding',
          content: {
            exerciseId: 'c4l1-student',
            task: '实现 `Person`（name 字段、接收 name 的构造器）与 `Student extends Person`（增加 school 字段，构造器调用 super）。读入姓名与学校，输出 `name@school`。',
            io: `输入：两行文本（姓名、学校）
输出：name@school
样例：输入 Ada 和 MIT → 输出 Ada@MIT
约束：Student 必须通过 super 初始化 name。`,
            skeleton: `import java.util.Scanner;

public class Main {
    static class Person {
        String name;

        Person(String name) {
            // 保存 name
        }
    }

    static class Student extends Person {
        String school;

        Student(String name, String school) {
            // 调用父类构造器，再保存 school
        }
    }

    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);
        Student student = new Student(scanner.nextLine(), scanner.nextLine());
        System.out.println(student.name + "@" + student.school);
    }
}`,
            hints: [
              '概念回顾：构造器不继承；子类必须先初始化父类部分。',
              '解题方向：Person 构造器写 this.name；Student 构造器第一行 super(name)，再 this.school。',
              '关键 API：`super(...)`。',
            ],
            tests: [
              {
                label: '普通学生',
                kind: 'normal',
                stdin: 'Ada\nMIT\n',
                expectedStdout: 'Ada@MIT\n',
              },
              {
                label: '空学校名',
                kind: 'edge',
                stdin: 'Bob\n\n',
                expectedStdout: 'Bob@\n',
              },
              {
                label: '中文姓名',
                kind: 'tricky',
                stdin: '李雷\n北大\n',
                expectedStdout: '李雷@北大\n',
              },
            ],
            answer: `import java.util.Scanner;

public class Main {
    static class Person {
        String name;

        Person(String name) {
            this.name = name;
        }
    }

    static class Student extends Person {
        String school;

        Student(String name, String school) {
            super(name);
            this.school = school;
        }
    }

    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);
        Student student = new Student(scanner.nextLine(), scanner.nextLine());
        System.out.println(student.name + "@" + student.school);
    }
}`,
            answerWhy:
              'Student 的构造器先调用 super(name) 完成 Person 部分，再初始化 school。父类字段 name 已存在，子类可以直接读取。',
          },
        },
        {
          id: 'c4l1-s6',
          type: 'summary',
          content: {
            points: [
              {
                kind: 'general',
                text: '**一般规则**：extends 表示 is-a；子类继承可访问的字段和方法，但不继承构造器。',
              },
              {
                kind: 'general',
                text: '**一般规则**：子类构造器必须先调用父类构造器；`super(...)` 必须是第一条语句。',
              },
              {
                kind: 'general',
                text: '**一般规则**：初始化顺序是父类部分先于子类部分；父类没有无参构造器时必须显式传参。',
              },
              {
                kind: 'scenario',
                text: 'Animal / Dog 展示构造器链；Employee / Manager 展示带参数父类构造器的强制 super 调用。',
              },
            ],
          },
        },
        {
          id: 'c4l1-s7',
          type: 'pitfall',
          content: {
            items: [
              {
                wrong: 'class Parent { Parent(int x) { ... } }\nclass Child extends Parent { Child() { } }',
                why: 'Parent 没有无参构造器，Child 的隐式 super() 找不到匹配项，编译失败。',
                right: 'Child() { super(0); } 或给 Parent 增加无参构造器。',
              },
              {
                wrong: 'Child() {\n    System.out.println("start");\n    super();\n}',
                why: 'super(...) 必须是构造器第一条语句。',
                right: '把 super(...) 移到第一行。',
              },
              {
                wrong: '认为子类对象里没有父类的私有字段。',
                why: '父类的私有字段仍然存在于对象中，只是子类不能直接访问。',
                right: '通过父类提供的 public / protected 方法访问。',
              },
            ],
          },
        },
      ],
    },
    {
      id: 'c4l2',
      chapter: 4,
      title: '重写与重载：同名方法的两种关系',
      summary: '重写发生在父子类之间、签名相同；重载发生在同一个类里、参数列表不同。两者解决的问题完全不同。',
      steps: [
        {
          id: 'c4l2-s1',
          type: 'goal',
          content: {
            text: '你能区分重写（Overriding）与重载（Overloading），写出满足规则的重写方法，并用 @Override 让编译器帮你检查。',
            checklist: ['知道重写的签名规则', '知道重载在编译期决定', '会使用 super.method() 调用父类版本'],
          },
        },
        {
          id: 'c4l2-s2',
          type: 'concept',
          content: {
            title: '重写改行为，重载改入口',
            paragraphs: [
              '**重写（Overriding）**：子类提供与父类**同名、同参数列表**的方法，改变运行时的行为。返回类型可以协变（子类型），访问权限不能收窄。',
              '**重载（Overloading）**：同一个类中同名但**参数列表不同**的方法；编译器根据实参类型选择调用哪一个。',
              '`@Override` 不是必须的，但它让编译器检查“确实重写了父类方法”，拼错方法名时会直接报错。',
              '重写不能降低访问权限（public 不能改成 private）；不能重写 final 方法；static 方法属于类，不参与动态分派。',
              '`super.speak()` 可以在子类中调用父类的版本，通常用于在父类行为基础上追加。',
              'Go 没有重载；Python 没有真正的编译期重载。Java 的重载解析发生在编译期。',
            ],
            table: {
              headers: ['维度', '重写 Overriding', '重载 Overloading'],
              rows: [
                ['位置', '父类与子类之间', '同一个类（或继承来的方法）'],
                ['方法名', '相同', '相同'],
                ['参数列表', '必须相同', '必须不同'],
                ['决定时机', '运行时（动态分派）', '编译期（按实参类型）'],
                ['返回类型', '可协变', '可不同'],
                ['访问权限', '不能收窄', '无父子约束'],
              ],
            },
            note: '参数列表不同包括类型、个数、顺序不同；仅返回类型不同不构成重载，编译器会报错。',
          },
        },
        {
          id: 'c4l2-s3',
          type: 'example',
          content: {
            scenarios: [
              {
                name: '场景 1：重写 speak',
                code: `class Animal {
    String speak() {
        return "...";
    }
}

class Dog extends Animal {
    @Override
    String speak() {
        return "Woof";
    }
}

public class OverrideDemo {
    public static void main(String[] args) {
        Animal animal = new Dog();
        System.out.println(animal.speak());
    }
}`,
                output: 'Woof',
                lineNotes: {
                  2: '父类定义默认行为。',
                  8: '子类重写：同名、同参数列表。',
                  9: '@Override 让编译器确认确实重写了父类方法。',
                  16: '父类引用指向子类对象；调用的是子类重写后的版本。',
                },
                takeaway: '**一般规则**：重写改变的是“同一个方法调用在不同子类对象上的行为”，这就是多态的基础。',
              },
              {
                name: '场景 2：重载提供不同入口',
                code: `public class OverloadDemo {
    static void show(int x) {
        System.out.println("int " + x);
    }

    static void show(String x) {
        System.out.println("String " + x);
    }

    static void show(int x, int y) {
        System.out.println("int,int " + (x + y));
    }

    public static void main(String[] args) {
        show(7);
        show("7");
        show(3, 4);
    }
}`,
                output: 'int 7\nString 7\nint,int 7',
                lineNotes: {
                  2: '第一个重载接收 int。',
                  6: '第二个重载接收 String；参数类型不同。',
                  10: '第三个重载接收两个 int；参数个数不同。',
                  15: '实参是 int，编译器选择 show(int)。',
                  16: '实参是 String，编译器选择 show(String)。',
                  17: '两个 int，选择双参数版本。',
                },
                takeaway: '**一般规则**：重载在编译期按实参的静态类型选择；与运行时对象类型无关。',
              },
            ],
          },
        },
        {
          id: 'c4l2-s4',
          type: 'quiz',
          content: {
            kind: 'choice',
            question: '下面哪一组方法构成重写（Overriding）？',
            options: [
              '同一个类里 `print(int)` 与 `print(String)`',
              '父类 `void run()` 与子类 `void run()`',
              '父类 `int value()` 与子类 `long value()`',
              '父类 `void run()` 与子类 `void run(int speed)`',
            ],
            answerIndex: 1,
            explanation:
              '重写要求父子类、同名、同参数列表。A 是重载；C 返回类型不兼容（long 不是 int 的子类型）；D 参数列表不同，是重载 / 新方法。',
          },
        },
        {
          id: 'c4l2-s5',
          type: 'coding',
          content: {
            exerciseId: 'c4l2-greet',
            task: '父类 `Greeter` 的 `greet()` 返回 `hello`；子类 `ChineseGreeter` 重写为 `你好`。读入姓名，输出 `问候, 姓名`。',
            io: `输入：一行姓名
输出：问候语 + ", " + 姓名
样例：输入 Ada → 输出 你好, Ada
约束：必须使用重写，不能直接改父类。`,
            skeleton: `import java.util.Scanner;

public class Main {
    static class Greeter {
        String greet() {
            return "hello";
        }
    }

    static class ChineseGreeter extends Greeter {
        // 重写 greet
    }

    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);
        String name = scanner.nextLine();
        Greeter greeter = new ChineseGreeter();
        System.out.println(greeter.greet() + ", " + name);
    }
}`,
            hints: [
              '概念回顾：重写需要同名、同参数列表，并建议加 @Override。',
              '解题方向：在 ChineseGreeter 里写 `@Override String greet() { return "你好"; }`。',
              '关键 API：`@Override` 注解。',
            ],
            tests: [
              {
                label: '普通姓名',
                kind: 'normal',
                stdin: 'Ada\n',
                expectedStdout: '你好, Ada\n',
              },
              {
                label: '空姓名',
                kind: 'edge',
                stdin: '\n',
                expectedStdout: '你好, \n',
              },
              {
                label: '中文姓名',
                kind: 'tricky',
                stdin: '李雷\n',
                expectedStdout: '你好, 李雷\n',
              },
            ],
            answer: `import java.util.Scanner;

public class Main {
    static class Greeter {
        String greet() {
            return "hello";
        }
    }

    static class ChineseGreeter extends Greeter {
        @Override
        String greet() {
            return "你好";
        }
    }

    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);
        String name = scanner.nextLine();
        Greeter greeter = new ChineseGreeter();
        System.out.println(greeter.greet() + ", " + name);
    }
}`,
            answerWhy:
              'ChineseGreeter 保持方法签名不变，只改返回值。main 用父类引用调用，运行时仍然分派到子类重写的方法，输出“你好”。',
          },
        },
        {
          id: 'c4l2-s6',
          type: 'summary',
          content: {
            points: [
              {
                kind: 'general',
                text: '**一般规则**：重写 = 父子类 + 同名同参数；重载 = 同名不同参数，编译器按实参选择。',
              },
              {
                kind: 'general',
                text: '**一般规则**：重写不能收窄访问权限，不能重写 final 方法；返回类型可以协变。',
              },
              {
                kind: 'general',
                text: '**一般规则**：用 @Override 让编译器验证签名；需要复用父类行为时调用 super.method()。',
              },
              {
                kind: 'scenario',
                text: 'Dog 重写 speak 改变运行时行为；OverloadDemo 用不同参数列表提供多个入口。',
              },
            ],
          },
        },
        {
          id: 'c4l2-s7',
          type: 'pitfall',
          content: {
            items: [
              {
                wrong: 'class Dog extends Animal {\n    String Speak() { ... }  // 大写 S\n}',
                why: '方法名大小写不同，这不是重写，而是新方法；父类引用调用时仍走父类版本。',
                right: '写 `String speak()` 并加 @Override，让编译器检查。',
              },
              {
                wrong: 'class Child extends Parent {\n    private void run() { ... }  // 父类 public\n}',
                why: '重写不能收窄访问权限，编译失败。',
                right: '保持 public，或扩大可见性。',
              },
              {
                wrong: 'static void run() 与父类实例方法 run() 视为重写。',
                why: 'static 方法属于类，不参与动态分派；这通常会产生隐藏或编译错误。',
                right: '区分静态方法与实例方法，不要用 static 去“重写”实例方法。',
              },
            ],
          },
        },
      ],
    },
    {
      id: 'c4l3',
      chapter: 4,
      title: '多态：父类引用指向子类对象',
      summary: '父类引用可以指向子类对象；方法在运行时按真实对象分派，字段则按引用类型访问。',
      steps: [
        {
          id: 'c4l3-s1',
          type: 'goal',
          content: {
            text: '你能用父类引用统一处理不同子类对象，解释编译期类型与运行时类型的区别，并知道字段不会被多态覆盖。',
            checklist: ['会写父类引用 = 子类对象', '知道重写方法动态分派', '知道字段按引用类型访问'],
          },
        },
        {
          id: 'c4l3-s2',
          type: 'concept',
          content: {
            title: '编译期看类型，运行期看对象',
            paragraphs: [
              '`Animal animal = new Dog();` 中，引用的**编译期类型**是 Animal，**运行时对象**是 Dog。',
              '能调用哪些方法由编译期类型决定；调用的是哪个重写版本由运行时对象决定，这叫**动态分派**。',
              '字段不参与多态：通过父类引用访问字段，拿到的是父类声明的那个字段，即使子类声明了同名字段。',
              '需要调用子类特有方法时，先用 `instanceof` 检查并强转；Java 16+ 支持模式匹配 `if (a instanceof Dog dog)`。',
              '`instanceof` 对 null 返回 false；强转不兼容的类型会抛 `ClassCastException`。',
              '多态的价值是把“对不同子类分别写 if/else”变成“统一调用一个父类方法”。',
            ],
            table: {
              headers: ['访问内容', '由什么决定', '示例结果'],
              rows: [
                ['可调用的方法名', '引用类型（编译期）', 'Animal 引用不能直接调用 Dog 特有方法'],
                ['重写方法的实际实现', '对象类型（运行期）', 'Animal 引用指向 Dog 时调用 Dog.speak'],
                ['字段值', '引用类型（编译期）', 'Parent p = new Child() 读 p.name 得到 Parent 的字段'],
                ['static 方法', '引用类型（编译期）', '静态方法不参与动态分派'],
              ],
            },
            note: '把方法设计成可重写的实例方法，才能获得多态；字段和 static 方法都不是多态的入口。',
          },
        },
        {
          id: 'c4l3-s3',
          type: 'example',
          content: {
            scenarios: [
              {
                name: '场景 1：统一计算不同图形的面积',
                code: `class Shape {
    double area() {
        return 0;
    }
}

class Circle extends Shape {
    double radius;

    Circle(double radius) {
        this.radius = radius;
    }

    @Override
    double area() {
        return Math.PI * radius * radius;
    }
}

class Rectangle extends Shape {
    double width;
    double height;

    Rectangle(double width, double height) {
        this.width = width;
        this.height = height;
    }

    @Override
    double area() {
        return width * height;
    }
}

public class ShapeDemo {
    public static void main(String[] args) {
        Shape[] shapes = { new Circle(1), new Rectangle(3, 4) };
        for (Shape shape : shapes) {
            System.out.printf("%.2f%n", shape.area());
        }
    }
}`,
                output: '3.14\n12.00',
                lineNotes: {
                  1: '父类提供统一的 area 方法，返回值只是默认值。',
                  16: 'Circle 重写 area，使用自己的 radius。',
                  31: 'Rectangle 重写 area，使用自己的宽高。',
                  37: '数组的编译期类型是 Shape[]，可以同时放不同子类对象。',
                  38: '循环变量 shape 的编译期类型仍是 Shape。',
                  39: '运行时按真实对象分派：第一次调用 Circle.area，第二次 Rectangle.area。',
                },
                takeaway: '**一般规则**：把共同行为放到父类签名里，用父类引用批量处理子类对象；具体实现由运行时对象决定。',
              },
              {
                name: '场景 2：字段按引用类型访问',
                code: `class Parent {
    String name = "parent";

    String who() {
        return "parent()";
    }
}

class Child extends Parent {
    String name = "child";

    @Override
    String who() {
        return "child()";
    }
}

public class FieldDispatch {
    public static void main(String[] args) {
        Parent ref = new Child();
        System.out.println(ref.name);
        System.out.println(ref.who());
    }
}`,
                output: 'parent\nchild()',
                lineNotes: {
                  2: '父类声明字段 name。',
                  10: '子类声明了同名字段；这不是重写，而是隐藏。',
                  12: '子类重写 who 方法。',
                  20: '引用类型是 Parent，运行时对象是 Child。',
                  21: '字段按引用类型访问，得到父类字段 parent。',
                  22: '方法按运行时对象分派，得到子类实现 child()。',
                },
                takeaway: '**一般规则**：多态只作用于可重写的实例方法；字段与静态成员按引用类型解析。',
              },
            ],
          },
        },
        {
          id: 'c4l3-s4',
          type: 'quiz',
          content: {
            kind: 'judge',
            statement: '`Parent ref = new Child();` 之后，`ref.name` 一定读到 Child 中声明的同名字段。',
            answer: false,
            explanation: '字段不参与动态分派。ref 的编译期类型是 Parent，所以 ref.name 访问的是 Parent 声明的字段；Child 中的同名字段只是被隐藏。',
          },
        },
        {
          id: 'c4l3-s5',
          type: 'coding',
          content: {
            exerciseId: 'c4l3-sounds',
            task: '父类 `Animal` 的 `sound()` 返回 `...`；`Dog` 返回 `Woof`，`Cat` 返回 `Meow`。读入 n 与 n 个类型（dog / cat），用 Animal 数组按顺序输出叫声。',
            io: `输入：n，随后 n 个单词（dog / cat）
输出：每个动物一行叫声
样例：输入 "2 dog cat" → 输出 Woof 换行 Meow
约束：用父类引用数组保存子类对象。`,
            skeleton: `import java.util.Scanner;

public class Main {
    static class Animal {
        String sound() {
            return "...";
        }
    }

    static class Dog extends Animal {
        @Override
        String sound() {
            return "Woof";
        }
    }

    static class Cat extends Animal {
        @Override
        String sound() {
            return "Meow";
        }
    }

    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);
        int n = scanner.nextInt();
        Animal[] animals = new Animal[n];
        // 根据类型创建对象，再按顺序输出 sound
    }
}`,
            hints: [
              '概念回顾：父类引用可以指向子类对象，重写方法在运行时决定。',
              '解题方向：读一个类型字符串，用 if/else 创建 Dog 或 Cat，放进 Animal 数组。',
              '关键 API：数组 + 增强 for + `sound()`。',
            ],
            tests: [
              {
                label: '一只狗一只猫',
                kind: 'normal',
                stdin: '2 dog cat\n',
                expectedStdout: 'Woof\nMeow\n',
              },
              {
                label: '只有一只狗',
                kind: 'edge',
                stdin: '1 dog\n',
                expectedStdout: 'Woof\n',
              },
              {
                label: '两只猫一只狗',
                kind: 'tricky',
                stdin: '3 cat cat dog\n',
                expectedStdout: 'Meow\nMeow\nWoof\n',
              },
            ],
            answer: `import java.util.Scanner;

public class Main {
    static class Animal {
        String sound() {
            return "...";
        }
    }

    static class Dog extends Animal {
        @Override
        String sound() {
            return "Woof";
        }
    }

    static class Cat extends Animal {
        @Override
        String sound() {
            return "Meow";
        }
    }

    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);
        int n = scanner.nextInt();
        Animal[] animals = new Animal[n];
        for (int i = 0; i < n; i++) {
            String type = scanner.next();
            animals[i] = type.equals("dog") ? new Dog() : new Cat();
        }
        for (Animal animal : animals) {
            System.out.println(animal.sound());
        }
    }
}`,
            answerWhy:
              '数组的编译期类型是 Animal[]，元素可以是任意子类。循环里统一调用 sound()，运行时按真实对象分派到 Dog 或 Cat 的重写版本。',
          },
        },
        {
          id: 'c4l3-s6',
          type: 'summary',
          content: {
            points: [
              {
                kind: 'general',
                text: '**一般规则**：父类引用可以指向子类对象；能调用什么看引用类型，调用哪个实现看对象类型。',
              },
              {
                kind: 'general',
                text: '**一般规则**：只有可重写的实例方法参与多态；字段和 static 方法按编译期类型解析。',
              },
              {
                kind: 'general',
                text: '**一般规则**：子类特有方法要先 instanceof 判断再强转；instanceof 对 null 返回 false。',
              },
              {
                kind: 'scenario',
                text: 'Shape 数组统一计算面积；Parent / Child 展示字段隐藏与方法分派的差异。',
              },
            ],
          },
        },
        {
          id: 'c4l3-s7',
          type: 'pitfall',
          content: {
            items: [
              {
                wrong: 'Parent ref = new Child();\nSystem.out.println(ref.childOnlyField);',
                why: '编译期类型是 Parent，看不到 Child 新增的成员，编译失败。',
                right: '先强转 `((Child) ref).childOnlyField`，或改用父类已有的方法。',
              },
              {
                wrong: 'Child c = (Child) new Parent();',
                why: '运行时对象不是 Child，强转抛 ClassCastException。',
                right: '强转前用 `instanceof` 检查。',
              },
              {
                wrong: '用父类引用调用 static 方法，期待子类版本。',
                why: 'static 方法按引用类型在编译期解析，不参与动态分派。',
                right: '不要在子类“重写”静态方法；需要多态就写成实例方法。',
              },
            ],
          },
        },
      ],
    },
    {
      id: 'c4l4',
      chapter: 4,
      title: 'final 与抽象类',
      summary: 'final 禁止修改或继承；抽象类不能实例化，用来固定骨架并强制子类实现抽象方法。',
      steps: [
        {
          id: 'c4l4-s1',
          type: 'goal',
          content: {
            text: '你能正确使用 final 修饰变量、方法和类，并用抽象类 + 模板方法约束子类必须实现的部分。',
            checklist: ['区分 final 变量 / 方法 / 类', '知道抽象类不能 new', '会写模板方法'],
          },
        },
        {
          id: 'c4l4-s2',
          type: 'concept',
          content: {
            title: '禁止变化，或者强制实现',
            paragraphs: [
              '`final` 变量只能赋值一次；`final` 方法不能被子类重写；`final` 类不能被继承。',
              '`final` 引用变量不能再指向别的对象，但它指向的对象内部状态仍可改变（除非对象自身不可变）。',
              '`abstract` 类不能直接 `new`；它可以包含抽象方法和具体方法。',
              '抽象方法只有签名、没有方法体；子类必须实现，除非子类自己也声明为 abstract。',
              '**模板方法**：父类把流程固定为 final 方法，把可变步骤声明为 abstract，由子类填充。这是“固定骨架 + 开放扩展点”的常见写法。',
              'final 与 abstract 不能同时修饰同一个方法：一个禁止重写，一个要求实现，语义冲突。',
            ],
            table: {
              headers: ['修饰', '作用对象', '效果'],
              rows: [
                ['`final` 变量', '字段 / 局部变量', '只能赋值一次'],
                ['`final` 方法', '方法', '子类不能重写'],
                ['`final` 类', '类', '不能被继承'],
                ['`abstract` 类', '类', '不能实例化，可含抽象方法'],
                ['`abstract` 方法', '方法', '没有方法体，子类必须实现'],
              ],
            },
            note: '不可变类通常同时使用 final 类和 final 字段，例如 String；这能保证对象发布后状态不再变化。',
          },
        },
        {
          id: 'c4l4-s3',
          type: 'example',
          content: {
            scenarios: [
              {
                name: '场景 1：抽象类统一图形接口',
                code: `abstract class Shape {
    abstract double area();

    String label() {
        return "shape";
    }
}

class Square extends Shape {
    private final double side;

    Square(double side) {
        this.side = side;
    }

    @Override
    double area() {
        return side * side;
    }
}

public class AbstractDemo {
    public static void main(String[] args) {
        Shape shape = new Square(3);
        System.out.println(shape.area());
        System.out.println(shape.label());
    }
}`,
                output: '9.0\nshape',
                lineNotes: {
                  1: 'Shape 是抽象类，不能直接创建对象。',
                  2: 'area 是抽象方法，子类必须实现。',
                  4: '抽象类也可以有具体方法，供子类复用。',
                  10: 'side 是 final，构造器赋值后不能再改。',
                  24: '用抽象父类引用指向具体子类对象。',
                  25: '调用子类实现的 area。',
                  26: '调用父类继承来的具体方法。',
                },
                takeaway: '**一般规则**：抽象类既能定义契约（抽象方法），也能提供复用（具体方法）；不能实例化但可以当作引用类型。',
              },
              {
                name: '场景 2：final 模板方法固定流程',
                code: `abstract class Report {
    final void render() {
        System.out.println("== 报表 ==");
        body();
        System.out.println("== 结束 ==");
    }

    abstract void body();
}

class SalesReport extends Report {
    @Override
    void body() {
        System.out.println("销售额: 1200");
    }
}

public class TemplateDemo {
    public static void main(String[] args) {
        new SalesReport().render();
    }
}`,
                output: '== 报表 ==\n销售额: 1200\n== 结束 ==',
                lineNotes: {
                  2: 'render 是 final：子类不能改变整体流程。',
                  4: '中间步骤调用抽象方法，具体内容由子类决定。',
                  8: '子类必须实现 body。',
                  14: '子类只填充可变部分。',
                  20: '调用固定的 render 流程。',
                },
                takeaway: '**一般规则**：模板方法用 final 固定算法骨架，用 abstract 开放步骤；子类只能扩展步骤，不能改流程。',
              },
            ],
          },
        },
        {
          id: 'c4l4-s4',
          type: 'quiz',
          content: {
            kind: 'choice',
            question: '关于抽象类，下面哪一句正确？',
            options: [
              '抽象类可以直接 `new`',
              '抽象类只能有抽象方法',
              '抽象类不能实例化，但可以有具体方法和字段',
              '抽象类的子类必须也是抽象类',
            ],
            answerIndex: 2,
            explanation:
              '抽象类不能实例化；它可以同时有抽象方法、具体方法和字段。子类只要实现全部抽象方法就可以是具体类。',
          },
        },
        {
          id: 'c4l4-s5',
          type: 'coding',
          content: {
            exerciseId: 'c4l4-salary',
            task: '抽象类 `Employee` 声明抽象方法 `salary()`；`HourlyEmployee` 用小时数 × 时薪实现。读入小时数与时薪，输出工资。',
            io: `输入：两个整数（小时数、时薪）
输出：工资
样例：输入 10 20 → 输出 200
约束：用抽象类与抽象方法；结果为 int。`,
            skeleton: `import java.util.Scanner;

public class Main {
    static abstract class Employee {
        abstract int salary();
    }

    static class HourlyEmployee extends Employee {
        private final int hours;
        private final int rate;

        HourlyEmployee(int hours, int rate) {
            this.hours = hours;
            this.rate = rate;
        }

        @Override
        int salary() {
            // 返回小时数 × 时薪
            return 0;
        }
    }

    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);
        Employee employee = new HourlyEmployee(scanner.nextInt(), scanner.nextInt());
        System.out.println(employee.salary());
    }
}`,
            hints: [
              '概念回顾：抽象方法没有方法体，子类必须实现。',
              '解题方向：在 HourlyEmployee.salary 中返回 hours * rate。',
              '关键 API：不需要额外 API。',
            ],
            tests: [
              {
                label: '普通工时',
                kind: 'normal',
                stdin: '10 20\n',
                expectedStdout: '200\n',
              },
              {
                label: '零工时',
                kind: 'edge',
                stdin: '0 50\n',
                expectedStdout: '0\n',
              },
              {
                label: '奇数的乘积',
                kind: 'tricky',
                stdin: '3 7\n',
                expectedStdout: '21\n',
              },
            ],
            answer: `import java.util.Scanner;

public class Main {
    static abstract class Employee {
        abstract int salary();
    }

    static class HourlyEmployee extends Employee {
        private final int hours;
        private final int rate;

        HourlyEmployee(int hours, int rate) {
            this.hours = hours;
            this.rate = rate;
        }

        @Override
        int salary() {
            return hours * rate;
        }
    }

    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);
        Employee employee = new HourlyEmployee(scanner.nextInt(), scanner.nextInt());
        System.out.println(employee.salary());
    }
}`,
            answerWhy:
              'Employee 只声明“有工资”这个契约；HourlyEmployee 决定计算方式。main 用抽象父类引用调用，运行时执行子类实现。',
          },
        },
        {
          id: 'c4l4-s6',
          type: 'summary',
          content: {
            points: [
              {
                kind: 'general',
                text: '**一般规则**：final 变量只赋值一次、final 方法不可重写、final 类不可继承。',
              },
              {
                kind: 'general',
                text: '**一般规则**：抽象类不能实例化，但能作为引用类型；抽象方法强制子类提供实现。',
              },
              {
                kind: 'general',
                text: '**一般规则**：模板方法用 final 固定流程、用 abstract 开放步骤，适合“流程稳定、细节可变”的场景。',
              },
              {
                kind: 'scenario',
                text: '抽象图形统一 area 契约；报表模板固定渲染流程，只让子类填写内容。',
              },
            ],
          },
        },
        {
          id: 'c4l4-s7',
          type: 'pitfall',
          content: {
            items: [
              {
                wrong: 'final abstract void run();',
                why: 'final 禁止重写，abstract 要求子类实现，语义冲突。',
                right: '二者只能选一个。',
              },
              {
                wrong: 'new Shape();  // Shape 是 abstract',
                why: '抽象类不能实例化。',
                right: '创建具体子类对象，用抽象父类引用接收。',
              },
              {
                wrong: 'final List<String> names = new ArrayList<>();\nnames.add("Ada");',
                why: 'final 只锁定引用，不锁定对象内部状态；List 仍然可以 add。',
                right: '需要内容不可变时用 `List.of(...)` 或不可变集合。',
              },
            ],
          },
        },
      ],
    },
    {
      id: 'c4l5',
      chapter: 4,
      title: '接口、默认方法与抽象类的选择',
      summary: '接口定义能力契约，可被多实现；默认方法提供可选复用。抽象类适合共享状态与部分实现，接口适合跨类型的能力。',
      steps: [
        {
          id: 'c4l5-s1',
          type: 'goal',
          content: {
            text: '你能定义接口、写出实现类、使用默认方法，并根据“是否需要共享状态”在抽象类与接口之间做选择。',
            checklist: ['知道接口方法默认是 public abstract', '知道一个类可实现多个接口', '知道默认方法的用途与冲突'],
          },
        },
        {
          id: 'c4l5-s2',
          type: 'concept',
          content: {
            title: '能力契约与可选复用',
            paragraphs: [
              '接口声明一组能力；实现类用 `implements` 承诺提供这些方法。一个类可以实现多个接口。',
              '接口中的抽象方法默认是 `public abstract`；字段默认是 `public static final` 常量。',
              'Java 8 起支持 **default 方法**：接口可以提供默认实现，实现类不强制重写；Java 9 起支持 private 方法供接口内部复用。',
              '默认方法冲突时，实现类必须显式重写，或用 `InterfaceName.super.method()` 指定。',
              '抽象类适合“有共同状态 + 部分实现 + 固定骨架”；接口适合“不相关的类型共享一种能力”，例如 Comparable、Runnable。',
              '一个类只能继承一个父类，但可以实现多个接口；这是接口在类型组合上的优势。',
            ],
            table: {
              headers: ['维度', '抽象类', '接口'],
              rows: [
                ['继承数量', '单继承', '可多实现'],
                ['字段', '任意实例 / 静态字段', '只能是 public static final 常量'],
                ['构造器', '有', '没有'],
                ['方法', '抽象 + 具体', '抽象 + default + static + private'],
                ['适用', '共享状态与骨架', '跨类型的能力契约'],
              ],
            },
            note: '接口常量是隐式 public static final；在接口里声明可变字段是不可能的。',
          },
        },
        {
          id: 'c4l5-s3',
          type: 'example',
          content: {
            scenarios: [
              {
                name: '场景 1：多种支付方式实现同一接口',
                code: `interface Payment {
    void pay(int cents);
}

class Alipay implements Payment {
    public void pay(int cents) {
        System.out.println("支付宝: " + cents);
    }
}

class WechatPay implements Payment {
    public void pay(int cents) {
        System.out.println("微信: " + cents);
    }
}

public class PaymentDemo {
    public static void main(String[] args) {
        Payment[] payments = { new Alipay(), new WechatPay() };
        for (Payment payment : payments) {
            payment.pay(500);
        }
    }
}`,
                output: '支付宝: 500\n微信: 500',
                lineNotes: {
                  1: '接口只声明能力，不关心具体支付渠道。',
                  6: '实现类必须写 public；接口方法隐式 public。',
                  11: '另一个不相关的类也可以实现同一个接口。',
                  19: '用接口数组统一处理不同实现。',
                  21: '调用同一个 pay，运行时分派到各自实现。',
                },
                takeaway: '**一般规则**：接口让不相关的类共享同一种能力；调用方依赖接口，而不是具体实现。',
              },
              {
                name: '场景 2：默认方法提供可选复用（Java 8+）',
                javaVersion: 'Java 8',
                code: `interface Greeter {
    String name();

    default String greet() {
        return "你好, " + name();
    }
}

class User implements Greeter {
    public String name() {
        return "Ada";
    }
}

public class DefaultDemo {
    public static void main(String[] args) {
        System.out.println(new User().greet());
    }
}`,
                output: '你好, Ada',
                lineNotes: {
                  2: 'name 是抽象方法，实现类必须提供。',
                  4: 'default 方法给出默认实现，实现类不必重写。',
                  5: '默认方法可以调用接口里的其他抽象方法。',
                  9: 'User 只实现了 name，没有实现 greet。',
                  17: '调用 greet 时使用接口提供的默认实现。',
                },
                takeaway: '**一般规则**：default 方法用于给接口增加“可选的通用实现”，不破坏已有实现类。',
              },
            ],
          },
        },
        {
          id: 'c4l5-s4',
          type: 'quiz',
          content: {
            kind: 'choice',
            question: '什么时候更应选择接口而不是抽象类？',
            options: [
              '需要共享实例字段和构造器',
              '需要不相关的类共享一种能力，并希望一个类实现多种能力',
              '需要固定一套流程骨架',
              '需要保存对象状态',
            ],
            answerIndex: 1,
            explanation:
              '接口适合跨类型的能力契约与多实现。共享状态、构造器、固定骨架更适合抽象类。',
          },
        },
        {
          id: 'c4l5-s5',
          type: 'coding',
          content: {
            exerciseId: 'c4l5-shape',
            task: '定义接口 `Shape`（`double area()`），实现 `Circle` 与 `Rectangle`。读入类型与参数，输出面积，保留两位小数。',
            io: `输入：类型 + 参数
- circle 半径
- rect 宽 高
输出：面积（两位小数）
样例：输入 "circle 1" → 输出 3.14
约束：用接口统一处理；使用 Locale.ROOT 格式化。`,
            skeleton: `import java.util.Locale;
import java.util.Scanner;

public class Main {
    interface Shape {
        double area();
    }

    static class Circle implements Shape {
        private final double radius;

        Circle(double radius) {
            this.radius = radius;
        }

        public double area() {
            // πr²
            return 0;
        }
    }

    static class Rectangle implements Shape {
        private final double width;
        private final double height;

        Rectangle(double width, double height) {
            this.width = width;
            this.height = height;
        }

        public double area() {
            // 宽 × 高
            return 0;
        }
    }

    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);
        String type = scanner.next();
        Shape shape = type.equals("circle")
                ? new Circle(scanner.nextDouble())
                : new Rectangle(scanner.nextDouble(), scanner.nextDouble());
        System.out.println(String.format(Locale.ROOT, "%.2f", shape.area()));
    }
}`,
            hints: [
              '概念回顾：接口只声明能力，具体实现由实现类提供。',
              '解题方向：Circle 返回 Math.PI * radius * radius；Rectangle 返回 width * height。',
              '关键 API：`Math.PI`、`String.format(Locale.ROOT, "%.2f", value)`。',
            ],
            tests: [
              {
                label: '单位圆',
                kind: 'normal',
                stdin: 'circle 1\n',
                expectedStdout: '3.14\n',
              },
              {
                label: '矩形',
                kind: 'normal',
                stdin: 'rect 3 4\n',
                expectedStdout: '12.00\n',
              },
              {
                label: '半径为 0',
                kind: 'edge',
                stdin: 'circle 0\n',
                expectedStdout: '0.00\n',
              },
              {
                label: '小数边长的矩形',
                kind: 'tricky',
                stdin: 'rect 2 2.5\n',
                expectedStdout: '5.00\n',
              },
            ],
            answer: `import java.util.Locale;
import java.util.Scanner;

public class Main {
    interface Shape {
        double area();
    }

    static class Circle implements Shape {
        private final double radius;

        Circle(double radius) {
            this.radius = radius;
        }

        public double area() {
            return Math.PI * radius * radius;
        }
    }

    static class Rectangle implements Shape {
        private final double width;
        private final double height;

        Rectangle(double width, double height) {
            this.width = width;
            this.height = height;
        }

        public double area() {
            return width * height;
        }
    }

    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);
        String type = scanner.next();
        Shape shape = type.equals("circle")
                ? new Circle(scanner.nextDouble())
                : new Rectangle(scanner.nextDouble(), scanner.nextDouble());
        System.out.println(String.format(Locale.ROOT, "%.2f", shape.area()));
    }
}`,
            answerWhy:
              '调用方只依赖 Shape 接口，不关心是圆还是矩形。格式化使用 Locale.ROOT，保证小数点始终是 "."，不受系统区域设置影响。',
          },
        },
        {
          id: 'c4l5-s6',
          type: 'summary',
          content: {
            points: [
              {
                kind: 'general',
                text: '**一般规则**：接口定义能力契约，类用 implements 承诺实现；一个类可实现多个接口。',
              },
              {
                kind: 'general',
                text: '**一般规则**：接口抽象方法隐式 public abstract，字段隐式 public static final；实现方法必须 public。',
              },
              {
                kind: 'general',
                text: '**一般规则**：需要共享状态、构造器或固定骨架选抽象类；需要跨类型能力与多实现选接口。',
              },
              {
                kind: 'scenario',
                text: '支付接口统一不同渠道；Greeter 的 default 方法给已有实现提供可选复用。',
              },
            ],
          },
        },
        {
          id: 'c4l5-s7',
          type: 'pitfall',
          content: {
            items: [
              {
                wrong: 'class Alipay implements Payment {\n    void pay(int cents) { ... }  // 少了 public\n}',
                why: '接口方法隐式 public，实现时不能收窄访问权限，编译失败。',
                right: 'public void pay(int cents) { ... }',
              },
              {
                wrong: '在接口里写 `int balance = 0;` 并试图修改它。',
                why: '接口字段隐式 public static final，不能重新赋值。',
                right: '状态放在实现类里，接口只保留常量。',
              },
              {
                wrong: '两个接口都有 default 方法 `run()`，实现类不重写。',
                why: '默认方法冲突，编译器要求实现类明确选择。',
                right: '重写 run()，或用 `A.super.run()` / `B.super.run()` 指定。',
              },
            ],
          },
        },
      ],
    },
  ],
}
