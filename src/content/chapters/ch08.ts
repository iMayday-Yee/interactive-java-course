import type { Chapter } from '../../types/content'

export const chapter08: Chapter = {
  id: 'chapter-8',
  number: 8,
  title: '泛型',
  subtitle: '泛型把类型检查提前到编译期；类型擦除决定了它的边界，通配符决定了谁能读、谁能写。',
  lessons: [
    {
      id: 'c8l1',
      chapter: 8,
      title: '泛型类与泛型方法',
      summary: '泛型用类型参数替代具体类型；编译期检查，避免强转。泛型参数只能是引用类型。',
      steps: [
        {
          id: 'c8l1-s1',
          type: 'goal',
          content: {
            text: '你能定义泛型类与泛型方法，理解类型参数的作用域与推断，并写出带边界的泛型方法。',
            checklist: ['会写 `Box<T>`', '会写 `<T> T method(...)`', '知道 `<T extends Number>` 的含义'],
          },
        },
        {
          id: 'c8l1-s2',
          type: 'concept',
          content: {
            title: '把类型也参数化',
            paragraphs: [
              '泛型让容器或算法在定义时不绑定具体类型，使用时再指定；编译器据此做类型检查。',
              '`class Box<T>` 中的 T 是类型参数；`Box<String>` 与 `Box<Integer>` 共享同一份类代码，但编译期类型不同。',
              '泛型方法在返回类型前声明类型参数：`static <T> T first(List<T> items)`；调用时通常能自动推断 T。',
              '边界 `T extends Number` 限制 T 必须是 Number 或其子类，方法内可以调用 Number 的方法。',
              '泛型参数只能是引用类型：`Box<int>` 非法，必须写 `Box<Integer>`；自动装箱会补上转换。',
              'Go 1.18+ 用类型参数实现泛型；Python 是动态类型，主要靠运行时与类型标注。三者的检查时机不同。',
            ],
            table: {
              headers: ['写法', '含义', '示例'],
              rows: [
                ['`Box<T>`', '泛型类', '`Box<String>`'],
                ['`<T> T first(...)`', '泛型方法', '`first(List.of("a"))`'],
                ['`<T extends Number>`', '上界', 'T 可调用 doubleValue'],
                ['`List<T>`', '容器使用类型参数', '编译期阻止放错类型'],
              ],
            },
            note: '泛型的好处不是“代码更短”，而是“错误更早暴露”：放错类型会在编译期失败，而不是运行时强转崩溃。',
          },
        },
        {
          id: 'c8l1-s3',
          type: 'example',
          content: {
            scenarios: [
              {
                name: '场景 1：泛型 Box 保存不同类型',
                code: `class Box<T> {
    private T value;

    Box(T value) {
        this.value = value;
    }

    T get() {
        return value;
    }

    void set(T value) {
        this.value = value;
    }
}

public class BoxDemo {
    public static void main(String[] args) {
        Box<String> text = new Box<>("java");
        Box<Integer> number = new Box<>(42);
        System.out.println(text.get());
        System.out.println(number.get() + 1);
    }
}`,
                output: 'java\n43',
                lineNotes: {
                  1: 'T 是类型参数，在使用时由具体类型替换。',
                  2: '字段类型是 T，不写死 String 或 Integer。',
                  8: 'get 返回 T；对 Box<String> 来说返回 String。',
                  19: '创建 Box<String>，编译器知道 get 返回 String。',
                  20: '创建 Box<Integer>，get 返回 Integer。',
                  21: 'String 直接输出。',
                  22: 'Integer 自动拆箱后加 1。',
                },
                takeaway: '**一般规则**：泛型类只写一份代码，类型参数在使用处绑定；取出元素不需要强转。',
              },
              {
                name: '场景 2：泛型方法与上界',
                code: `import java.util.List;

public class GenericMethod {
    static <T> T first(List<T> items) {
        return items.get(0);
    }

    static <T extends Comparable<T>> T max(T a, T b) {
        return a.compareTo(b) >= 0 ? a : b;
    }

    public static void main(String[] args) {
        System.out.println(first(List.of("a", "b")));
        System.out.println(max(3, 7));
        System.out.println(max("apple", "banana"));
    }
}`,
                output: 'a\n7\nbanana',
                lineNotes: {
                  4: '类型参数 T 只属于这个方法；参数与返回值使用同一个 T。',
                  5: '取出第一个元素，类型是 T。',
                  8: '上界 Comparable<T> 保证 a 有 compareTo 方法。',
                  9: '按 compareTo 结果返回较大者。',
                  13: '编译器从 List<String> 推断 T = String。',
                  14: '从两个 int 推断 T = Integer（自动装箱）。',
                  15: '从两个 String 推断 T = String。',
                },
                takeaway: '**一般规则**：泛型方法把类型参数写在返回类型前；上界让你在方法内安全调用边界类型的方法。',
              },
            ],
          },
        },
        {
          id: 'c8l1-s4',
          type: 'quiz',
          content: {
            kind: 'choice',
            question: '下面哪个泛型用法不合法？',
            options: ['`Box<String> box = new Box<>("x");`', '`List<Integer> nums = new ArrayList<>();`', '`Box<int> box = new Box<>(1);`', '`<T extends Number> double sum(T a)`'],
            answerIndex: 2,
            explanation: '泛型参数只能是引用类型，int 不能作为类型参数；应使用 Integer，自动装箱会处理转换。',
          },
        },
        {
          id: 'c8l1-s5',
          type: 'coding',
          content: {
            exerciseId: 'c8l1-max',
            task: '实现泛型方法 `<T extends Comparable<T>> T max(T a, T b)`。读入两个整数，输出较大者。',
            io: `输入：两个整数
输出：较大值
样例：输入 3 7 → 输出 7
约束：必须使用带边界的泛型方法。`,
            skeleton: `import java.util.Scanner;

public class Main {
    static <T extends Comparable<T>> T max(T a, T b) {
        // 比较并返回较大者
        return a;
    }

    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);
        int a = scanner.nextInt();
        int b = scanner.nextInt();
        System.out.println(max(a, b));
    }
}`,
            hints: [
              '概念回顾：`Comparable<T>` 提供 compareTo，返回值 >= 0 表示当前对象不小于参数。',
              '解题方向：`return a.compareTo(b) >= 0 ? a : b;`。',
              '关键 API：`Comparable.compareTo`。',
            ],
            tests: [
              {
                label: '第二个更大',
                kind: 'normal',
                stdin: '3 7\n',
                expectedStdout: '7\n',
              },
              {
                label: '两个相等',
                kind: 'edge',
                stdin: '5 5\n',
                expectedStdout: '5\n',
              },
              {
                label: '都是负数',
                kind: 'tricky',
                stdin: '-9 -2\n',
                expectedStdout: '-2\n',
              },
            ],
            answer: `import java.util.Scanner;

public class Main {
    static <T extends Comparable<T>> T max(T a, T b) {
        return a.compareTo(b) >= 0 ? a : b;
    }

    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);
        int a = scanner.nextInt();
        int b = scanner.nextInt();
        System.out.println(max(a, b));
    }
}`,
            answerWhy:
              '上界 Comparable<T> 保证 T 有 compareTo；方法对 Integer、String 等可比较类型都适用。main 传入 int，自动装箱为 Integer。',
          },
        },
        {
          id: 'c8l1-s6',
          type: 'summary',
          content: {
            points: [
              {
                kind: 'general',
                text: '**一般规则**：泛型把类型参数化，编译器据此检查，避免运行时强转。',
              },
              {
                kind: 'general',
                text: '**一般规则**：泛型参数只能是引用类型；基本类型要用包装类并自动装箱。',
              },
              {
                kind: 'general',
                text: '**一般规则**：泛型方法在返回类型前声明 `<T>`；`<T extends Bound>` 限定可调用的方法。',
              },
              {
                kind: 'scenario',
                text: 'Box 保存 String / Integer；first 与 max 展示类型推断与上界。',
              },
            ],
          },
        },
        {
          id: 'c8l1-s7',
          type: 'pitfall',
          content: {
            items: [
              {
                wrong: 'Box<int> box = new Box<>(1);',
                why: '泛型参数不能是基本类型。',
                right: 'Box<Integer> box = new Box<>(1);',
              },
              {
                wrong: 'List list = new ArrayList();\nlist.add("a");\nString s = (String) list.get(0);',
                why: '原始类型绕过了泛型检查，错误只能在运行时暴露。',
                right: '声明 `List<String>`，让编译器检查。',
              },
              {
                wrong: '认为 `Box<String>` 与 `Box<Integer>` 在运行时是两个不同的类。',
                why: '类型擦除后它们共享同一个类，运行时看不到类型参数。',
                right: '把泛型当作编译期约束，不要依赖运行时类型判断。',
              },
            ],
          },
        },
      ],
    },
    {
      id: 'c8l2',
      chapter: 8,
      title: '类型擦除及其限制',
      summary: '泛型在编译后被擦除为原始类型；因此不能 new T、不能 instanceof T、不能创建泛型数组。',
      steps: [
        {
          id: 'c8l2-s1',
          type: 'goal',
          content: {
            text: '你能解释类型擦除，列出泛型的常见限制，并识别原始类型造成的堆污染风险。',
            checklist: ['知道擦除到上界', '知道不能 new T / instanceof T', '知道原始类型会关闭泛型检查'],
          },
        },
        {
          id: 'c8l2-s2',
          type: 'concept',
          content: {
            title: '编译期存在，运行期消失',
            paragraphs: [
              'Java 泛型通过**类型擦除**实现：编译后类型参数被擦除为它的上界（默认 Object），运行时不再保留具体类型。',
              '所以 `List<String>` 与 `List<Integer>` 在运行时是同一个类；不能靠 `instanceof List<String>` 判断元素类型。',
              '限制：不能 `new T()`、不能 `new T[]`、不能 `instanceof T`、不能在静态上下文中使用类的类型参数、不能以泛型类型重载方法。',
              '原始类型（raw type）会关闭泛型检查；把错误类型放进集合，取出时才抛 ClassCastException，这叫堆污染。',
              '擦除会生成桥方法（bridge method）来维持重写与多态，但这是编译器实现细节，日常只需知道“运行时没有 T”。',
              'C++ 模板会为每组类型生成代码（具体化），Java 不会；这解释了 Java 泛型的限制与二进制兼容性取舍。',
            ],
            table: {
              headers: ['操作', '是否允许', '原因'],
              rows: [
                ['`new T()`', '否', '运行时不知道 T 的构造器'],
                ['`new T[10]`', '否', '运行时不知道元素类型'],
                ['`x instanceof T`', '否', '运行时没有 T'],
                ['`List<int>`', '否', '泛型参数必须是引用类型'],
                ['原始类型 `List`', '允许但有警告', '关闭泛型检查'],
              ],
            },
            note: '需要运行时类型信息时，把 `Class<T>` 作为参数传入（如 `Class<T> type`），不要试图从泛型参数里拿。',
          },
        },
        {
          id: 'c8l2-s3',
          type: 'example',
          content: {
            scenarios: [
              {
                name: '场景 1：不同类型参数共享同一个运行时类',
                code: `import java.util.ArrayList;
import java.util.List;

public class ErasureDemo {
    public static void main(String[] args) {
        List<String> names = new ArrayList<>();
        List<Integer> numbers = new ArrayList<>();
        System.out.println(names.getClass() == numbers.getClass());
        System.out.println(names.getClass().getName());
    }
}`,
                output: 'true\njava.util.ArrayList',
                lineNotes: {
                  6: '编译期类型是 List<String>。',
                  7: '编译期类型是 List<Integer>。',
                  8: '擦除后都是 ArrayList，运行时类相同，结果为 true。',
                  9: '运行时类名不包含 String 或 Integer。',
                },
                takeaway: '**一般规则**：泛型是编译期约束；运行时只能看到擦除后的原始类。',
              },
              {
                name: '场景 2：原始类型造成堆污染',
                code: `import java.util.ArrayList;
import java.util.List;

public class RawDemo {
    public static void main(String[] args) {
        List<String> names = new ArrayList<>();
        List raw = names;
        raw.add(42);
        String first = names.get(0);
        System.out.println(first);
    }
}`,
                output: 'Exception in thread "main" java.lang.ClassCastException: class java.lang.Integer cannot be cast to class java.lang.String',
                lineNotes: {
                  6: '一个正常声明为 List<String> 的集合。',
                  7: '赋给原始类型 List，泛型检查被绕过，编译器给出 unchecked 警告。',
                  8: '把 Integer 放进本应是 String 的集合。',
                  9: '取出时编译器插入强转 `(String)`，运行时发现是 Integer。',
                  10: '抛 ClassCastException，问题在很远的地方才暴露。',
                },
                takeaway: '**一般规则**：不要使用原始类型；它让错误从编译期推迟到运行时，并可能污染整个集合。',
              },
            ],
          },
        },
        {
          id: 'c8l2-s4',
          type: 'quiz',
          content: {
            kind: 'judge',
            statement: '在泛型类中可以直接写 `T[] values = new T[10];`。',
            answer: false,
            explanation: '类型擦除后运行时不知道 T 是什么，无法创建对应类型的数组；应使用 `Object[]` 加转换，或传入 `Class<T>` / 用集合代替数组。',
          },
        },
        {
          id: 'c8l2-s5',
          type: 'coding',
          content: {
            exerciseId: 'c8l2-count',
            task: '实现泛型方法 `<T> int count(List<T> items, T target)`：统计与 target 相等的元素个数（用 Objects.equals）。读入 n、n 个单词和目标单词，输出次数。',
            io: `输入：n，随后 n 个单词，最后一行是目标单词
输出：出现次数
样例：输入 3 / a b a / a → 输出 2
约束：使用泛型方法与 Objects.equals。`,
            skeleton: `import java.util.ArrayList;
import java.util.List;
import java.util.Objects;
import java.util.Scanner;

public class Main {
    static <T> int count(List<T> items, T target) {
        // 统计相等元素
        return 0;
    }

    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);
        int n = scanner.nextInt();
        List<String> words = new ArrayList<>();
        for (int i = 0; i < n; i++) {
            words.add(scanner.next());
        }
        String target = scanner.next();
        System.out.println(count(words, target));
    }
}`,
            hints: [
              '概念回顾：泛型方法在返回类型前声明 `<T>`，参数共享同一个 T。',
              '解题方向：遍历 items，用 `Objects.equals(item, target)` 判断相等。',
              '关键 API：`Objects.equals`、`List.size` / 增强 for。',
            ],
            tests: [
              {
                label: '出现两次',
                kind: 'normal',
                stdin: '3 a b a\na\n',
                expectedStdout: '2\n',
              },
              {
                label: '目标不存在',
                kind: 'edge',
                stdin: '2 x y\nz\n',
                expectedStdout: '0\n',
              },
              {
                label: '全部相同',
                kind: 'tricky',
                stdin: '4 go go go go\ngo\n',
                expectedStdout: '4\n',
              },
            ],
            answer: `import java.util.ArrayList;
import java.util.List;
import java.util.Objects;
import java.util.Scanner;

public class Main {
    static <T> int count(List<T> items, T target) {
        int total = 0;
        for (T item : items) {
            if (Objects.equals(item, target)) {
                total++;
            }
        }
        return total;
    }

    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);
        int n = scanner.nextInt();
        List<String> words = new ArrayList<>();
        for (int i = 0; i < n; i++) {
            words.add(scanner.next());
        }
        String target = scanner.next();
        System.out.println(count(words, target));
    }
}`,
            answerWhy:
              '方法对任意引用类型 T 都适用，比较交给 Objects.equals，避免 String 的 == 身份比较问题。擦除后 T 变为 Object，但编译期仍会检查调用参数类型。',
          },
        },
        {
          id: 'c8l2-s6',
          type: 'summary',
          content: {
            points: [
              {
                kind: 'general',
                text: '**一般规则**：泛型通过类型擦除实现，运行时不保留具体类型参数。',
              },
              {
                kind: 'general',
                text: '**一般规则**：不能 new T、new T[]、instanceof T；需要类型信息就传入 Class<T>。',
              },
              {
                kind: 'general',
                text: '**一般规则**：原始类型关闭泛型检查，可能造成堆污染；始终使用参数化类型。',
              },
              {
                kind: 'scenario',
                text: 'ErasureDemo 展示运行时类相同；RawDemo 展示原始类型导致的 ClassCastException。',
              },
            ],
          },
        },
        {
          id: 'c8l2-s7',
          type: 'pitfall',
          content: {
            items: [
              {
                wrong: 'T instance = new T();',
                why: '擦除后不知道 T 的构造器。',
                right: '把 `Supplier<T>` 或 `Class<T>` 传入，由调用方提供创建方式。',
              },
              {
                wrong: 'List raw = new ArrayList<String>();\nraw.add(1);',
                why: '原始类型绕过检查，运行时取出会 ClassCastException。',
                right: '写 `List<String>`，不要使用原始类型。',
              },
              {
                wrong: 'public void print(List<String> list) {}\npublic void print(List<Integer> list) {}',
                why: '擦除后签名都变成 print(List)，不能仅按泛型参数重载。',
                right: '使用方法名或额外参数区分重载。',
              },
            ],
          },
        },
      ],
    },
    {
      id: 'c8l3',
      chapter: 8,
      title: '通配符：? extends 与 ? super',
      summary: '生产者用 extends（只读），消费者用 super（可写）；List<Integer> 不是 List<Number>。',
      steps: [
        {
          id: 'c8l3-s1',
          type: 'goal',
          content: {
            text: '你能解释泛型不变性，使用 `? extends` 读取、`? super` 写入，并记住 PECS 口诀。',
            checklist: ['知道 List<Integer> 不能赋给 List<Number>', '知道 extends 只能读', '知道 super 可以写'],
          },
        },
        {
          id: 'c8l3-s2',
          type: 'concept',
          content: {
            title: '不变性、协变读取、逆变写入',
            paragraphs: [
              '泛型默认**不变**：`List<Integer>` 不是 `List<Number>`，即使 Integer 是 Number 的子类。否则可以把 Double 加进去，破坏类型安全。',
              '`List<? extends Number>` 表示“元素是 Number 或其子类的某个列表”；可以安全读取为 Number，但不能 add（除了 null）。',
              '`List<? super Integer>` 表示“元素是 Integer 或其父类的某个列表”；可以写入 Integer，但读取只能当作 Object。',
              '**PECS**：Producer Extends, Consumer Super。只读取（生产者）用 extends；只写入（消费者）用 super。',
              '`List<?>` 等价于 `List<? extends Object>`，只能读作 Object，不能写入非 null。',
              'Go / Python 没有 Java 这种通配符语法；理解它们的价值要回到“泛型不变性”这个约束。',
            ],
            table: {
              headers: ['写法', '能读成', '能写入', '典型用途'],
              rows: [
                ['`List<? extends Number>`', 'Number', '不能（null 除外）', '求和、遍历'],
                ['`List<? super Integer>`', 'Object', 'Integer 及其子类', '批量添加'],
                ['`List<?>`', 'Object', '不能（null 除外）', '只读查看'],
                ['`List<Number>`', 'Number', 'Number 及其子类', '精确类型'],
              ],
            },
            note: '通配符不是“任意类型随便用”，而是对读写能力做精确限制；限制越精确，接口越安全。',
          },
        },
        {
          id: 'c8l3-s3',
          type: 'example',
          content: {
            scenarios: [
              {
                name: '场景 1：extends 读取数字列表',
                code: `import java.util.List;

public class SumDemo {
    static double sum(List<? extends Number> numbers) {
        double total = 0;
        for (Number number : numbers) {
            total += number.doubleValue();
        }
        return total;
    }

    public static void main(String[] args) {
        System.out.println(sum(List.of(1, 2, 3)));
        System.out.println(sum(List.of(1.5, 2.5)));
    }
}`,
                output: '6.0\n4.0',
                lineNotes: {
                  4: '接受 Number 任意子类型的列表；List<Integer>、List<Double> 都能传入。',
                  6: '读取的元素一定可以当作 Number。',
                  7: '用 doubleValue 统一读取数值。',
                  13: 'List<Integer> 可以传给 extends Number 的参数。',
                  14: 'List<Double> 也可以。',
                },
                takeaway: '**一般规则**：只读取元素时用 `? extends T`，可以接收 T 的任意子类型列表。',
              },
              {
                name: '场景 2：super 写入 Integer',
                code: `import java.util.ArrayList;
import java.util.List;

public class AddDemo {
    static void addDefaults(List<? super Integer> target) {
        target.add(1);
        target.add(2);
    }

    public static void main(String[] args) {
        List<Number> numbers = new ArrayList<>();
        addDefaults(numbers);
        System.out.println(numbers);
    }
}`,
                output: '[1, 2]',
                lineNotes: {
                  5: '接受 Integer 或其父类型的列表。',
                  6: '写入 Integer 是安全的：目标列表至少能容纳 Integer。',
                  11: 'List<Number> 可以传给 `? super Integer`。',
                  12: '调用方法，加入两个 Integer。',
                  13: '输出 [1, 2]。',
                },
                takeaway: '**一般规则**：只写入元素时用 `? super T`，可以接收 T 的任意父类型容器。',
              },
            ],
          },
        },
        {
          id: 'c8l3-s4',
          type: 'quiz',
          content: {
            kind: 'choice',
            question: '一个方法只负责把 Integer 加入传入的列表，参数应写成？',
            options: ['`List<? extends Integer>`', '`List<? super Integer>`', '`List<Integer>`', '`List<?>`'],
            answerIndex: 1,
            explanation:
              '写入用 super（消费者）。`List<? extends Integer>` 不能 add；`List<Integer>` 太窄，无法接收 List<Number>；`List<?>` 不能写非 null。',
          },
        },
        {
          id: 'c8l3-s5',
          type: 'coding',
          content: {
            exerciseId: 'c8l3-sum',
            task: '实现 `double sum(List<? extends Number> numbers)`，读入 n 个整数并输出总和（double 形式）。',
            io: `输入：n，随后 n 个整数
输出：总和，如 6.0
样例：输入 "3 1 2 3" → 输出 6.0
约束：参数必须使用 ? extends Number。`,
            skeleton: `import java.util.ArrayList;
import java.util.List;
import java.util.Scanner;

public class Main {
    static double sum(List<? extends Number> numbers) {
        double total = 0;
        // 累加
        return total;
    }

    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);
        int n = scanner.nextInt();
        List<Integer> numbers = new ArrayList<>();
        for (int i = 0; i < n; i++) {
            numbers.add(scanner.nextInt());
        }
        System.out.println(sum(numbers));
    }
}`,
            hints: [
              '概念回顾：`? extends Number` 允许读取为 Number，但不允许写入。',
              '解题方向：遍历元素，累加 `number.doubleValue()`。',
              '关键 API：`Number.doubleValue`。',
            ],
            tests: [
              {
                label: '三个正整数',
                kind: 'normal',
                stdin: '3 1 2 3\n',
                expectedStdout: '6.0\n',
              },
              {
                label: '包含负数',
                kind: 'tricky',
                stdin: '3 -1 5 -2\n',
                expectedStdout: '2.0\n',
              },
              {
                label: '只有一个 0',
                kind: 'edge',
                stdin: '1 0\n',
                expectedStdout: '0.0\n',
              },
            ],
            answer: `import java.util.ArrayList;
import java.util.List;
import java.util.Scanner;

public class Main {
    static double sum(List<? extends Number> numbers) {
        double total = 0;
        for (Number number : numbers) {
            total += number.doubleValue();
        }
        return total;
    }

    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);
        int n = scanner.nextInt();
        List<Integer> numbers = new ArrayList<>();
        for (int i = 0; i < n; i++) {
            numbers.add(scanner.nextInt());
        }
        System.out.println(sum(numbers));
    }
}`,
            answerWhy:
              '`? extends Number` 接收 List<Integer>、List<Double> 等任意数值列表；方法只读取，不写入，所以 extends 合适。总和用 double 避免整数溢出。',
          },
        },
        {
          id: 'c8l3-s6',
          type: 'summary',
          content: {
            points: [
              {
                kind: 'general',
                text: '**一般规则**：泛型默认不变；`List<Integer>` 不能赋给 `List<Number>`。',
              },
              {
                kind: 'general',
                text: '**一般规则**：PECS —— 生产者用 `? extends T` 读取，消费者用 `? super T` 写入。',
              },
              {
                kind: 'general',
                text: '**一般规则**：extends 通配符不能 add（null 除外）；super 通配符读取只能当作 Object。',
              },
              {
                kind: 'scenario',
                text: 'sum 用 extends 接收多种数值列表；addDefaults 用 super 向父类型列表写入 Integer。',
              },
            ],
          },
        },
        {
          id: 'c8l3-s7',
          type: 'pitfall',
          content: {
            items: [
              {
                wrong: 'void add(List<? extends Number> nums) { nums.add(1); }',
                why: 'extends 通配符的列表可能是 List<Double>，写入 Integer 不安全，编译器禁止。',
                right: '写入用 `List<? super Integer>`。',
              },
              {
                wrong: 'List<Number> nums = new ArrayList<Integer>();',
                why: '泛型不变性：List<Integer> 不是 List<Number> 的子类型。',
                right: '写 `List<? extends Number>` 接收只读列表，或创建 `List<Number>`。',
              },
              {
                wrong: 'List<Object> objs = new ArrayList<String>();',
                why: '同样违反不变性；String 列表不能当作 Object 列表使用。',
                right: '需要只读时用 `List<? extends Object>` 或 `List<?>`。',
              },
            ],
          },
        },
      ],
    },
  ],
}
