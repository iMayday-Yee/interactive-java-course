import type { Chapter } from '../../types/content'

export const chapter05: Chapter = {
  id: 'chapter-5',
  number: 5,
  title: 'Object 类',
  subtitle: 'toString、equals、hashCode 的契约，是集合、缓存、比较逻辑的基础。写错一个，HashMap 就会“找不到刚放进去的 key”。',
  lessons: [
    {
      id: 'c5l1',
      chapter: 5,
      title: 'toString、equals 与 hashCode 的契约',
      summary: 'Object 是所有类的根；重写 equals 必须同时重写 hashCode，否则哈希容器会失效。',
      steps: [
        {
          id: 'c5l1-s1',
          type: 'goal',
          content: {
            text: '你能解释 Object 默认的 toString / equals / hashCode 行为，说出 equals 与 hashCode 的契约，并判断重写是否完整。',
            checklist: ['知道默认 equals 比较身份', '知道 equals 相等则 hashCode 必须相等', '知道 HashMap 为什么依赖这两个方法'],
          },
        },
        {
          id: 'c5l1-s2',
          type: 'concept',
          content: {
            title: '所有类都继承 Object',
            paragraphs: [
              '即使不写 `extends`，每个类也直接或间接继承 `Object`。`toString()`、`equals()`、`hashCode()`、`getClass()` 都来自它。',
              '默认 `toString()` 形如 `ClassName@十六进制hashCode`，通常不适合展示；需要可读文本时重写它。',
              '默认 `equals()` 等价于 `==`：比较引用身份。需要按内容判断相等时必须重写。',
              '**equals 契约**：自反、对称、传递、一致；与 null 比较必须返回 false。',
              '**hashCode 契约**：`equals` 为 true 的两个对象，`hashCode` 必须相同；`equals` 为 false 的对象，hashCode 可以相同（哈希冲突）。',
              '`HashMap` / `HashSet` 先用 hashCode 找桶，再用 equals 确认；只重写 equals 不重写 hashCode，两个“相等”的对象会落到不同的桶里。',
            ],
            table: {
              headers: ['方法', '默认行为', '重写时机'],
              rows: [
                ['`toString`', '类名@哈希值', '需要可读文本、日志、调试输出'],
                ['`equals`', '比较引用身份', '需要按字段内容判断相等'],
                ['`hashCode`', '与对象身份相关', '只要重写了 equals 就必须重写'],
                ['`getClass`', '返回运行时类', '一般不重写（final）'],
              ],
            },
            note: '契约不是建议：HashMap、HashSet、缓存、去重逻辑都依赖它。破坏契约会产生“看起来随机”的 bug。',
          },
        },
        {
          id: 'c5l1-s3',
          type: 'example',
          content: {
            scenarios: [
              {
                name: '场景 1：让 toString 输出可读坐标',
                code: `class Point {
    int x;
    int y;

    Point(int x, int y) {
        this.x = x;
        this.y = y;
    }

    @Override
    public String toString() {
        return "(" + x + ", " + y + ")";
    }
}

public class ToStringDemo {
    public static void main(String[] args) {
        Point point = new Point(1, 2);
        System.out.println(point);
        System.out.println(point.toString());
    }
}`,
                output: '(1, 2)\n(1, 2)',
                lineNotes: {
                  10: '重写 toString，返回业务上有意义的文本。',
                  12: '把字段拼成坐标形式。',
                  19: 'println(Object) 会自动调用 toString。',
                  20: '显式调用 toString 得到相同结果。',
                },
                takeaway: '**一般规则**：需要展示对象内容时重写 toString；println 会自动使用它。',
              },
              {
                name: '场景 2：只重写 equals，HashSet 去重失败',
                code: `import java.util.HashSet;
import java.util.Set;

class BadPoint {
    int x;
    int y;

    BadPoint(int x, int y) {
        this.x = x;
        this.y = y;
    }

    @Override
    public boolean equals(Object other) {
        if (!(other instanceof BadPoint)) {
            return false;
        }
        BadPoint point = (BadPoint) other;
        return x == point.x && y == point.y;
    }
}

public class EqualsOnly {
    public static void main(String[] args) {
        Set<BadPoint> set = new HashSet<>();
        set.add(new BadPoint(1, 2));
        set.add(new BadPoint(1, 2));
        System.out.println(set.size());
    }
}`,
                output: '2',
                lineNotes: {
                  13: '重写了 equals：内容相同的 BadPoint 会被判断为相等。',
                  21: '但没有重写 hashCode，两个对象仍使用 Object 的默认哈希。',
                  25: 'HashSet 先用 hashCode 找桶。',
                  26: '两个对象哈希不同，进入不同桶，HashSet 不会调用 equals 比较它们。',
                  28: '结果是 2，而不是期望的 1。',
                },
                takeaway: '**一般规则**：equals 与 hashCode 必须成对重写；哈希容器先按 hashCode 分桶，再按 equals 确认。',
              },
            ],
          },
        },
        {
          id: 'c5l1-s4',
          type: 'quiz',
          content: {
            kind: 'judge',
            statement: '如果两个对象的 `equals` 返回 true，它们的 `hashCode` 可以不同。',
            answer: false,
            explanation: '契约要求 equals 相等的对象 hashCode 必须相等。否则哈希容器会把它们放进不同桶，导致查找与去重失败。',
          },
        },
        {
          id: 'c5l1-s5',
          type: 'coding',
          content: {
            exerciseId: 'c5l1-point',
            task: '实现 `Point` 的 equals 与 hashCode：x、y 都相同才算相等。读入两个坐标，输出 `same` 或 `different`。',
            io: `输入：四个整数（x1 y1 x2 y2）
输出：same 或 different
样例：输入 1 2 1 2 → 输出 same
约束：重写 equals 时必须同时重写 hashCode。`,
            skeleton: `import java.util.Objects;
import java.util.Scanner;

public class Main {
    static class Point {
        final int x;
        final int y;

        Point(int x, int y) {
            this.x = x;
            this.y = y;
        }

        @Override
        public boolean equals(Object other) {
            // 按 x、y 比较
            return false;
        }

        @Override
        public int hashCode() {
            // 与 equals 保持一致
            return 0;
        }
    }

    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);
        Point a = new Point(scanner.nextInt(), scanner.nextInt());
        Point b = new Point(scanner.nextInt(), scanner.nextInt());
        System.out.println(a.equals(b) ? "same" : "different");
    }
}`,
            hints: [
              '概念回顾：equals 比较内容，hashCode 必须与 equals 一致。',
              '解题方向：equals 先判断类型，再比较两个字段；hashCode 用 Objects.hash(x, y)。',
              '关键 API：`instanceof`、`Objects.hash`。',
            ],
            tests: [
              {
                label: '坐标相同',
                kind: 'normal',
                stdin: '1 2 1 2\n',
                expectedStdout: 'same\n',
              },
              {
                label: '只有一个坐标相同',
                kind: 'tricky',
                stdin: '1 2 1 3\n',
                expectedStdout: 'different\n',
              },
              {
                label: '负数坐标',
                kind: 'edge',
                stdin: '-1 -2 -1 -2\n',
                expectedStdout: 'same\n',
              },
            ],
            answer: `import java.util.Objects;
import java.util.Scanner;

public class Main {
    static class Point {
        final int x;
        final int y;

        Point(int x, int y) {
            this.x = x;
            this.y = y;
        }

        @Override
        public boolean equals(Object other) {
            if (this == other) {
                return true;
            }
            if (!(other instanceof Point)) {
                return false;
            }
            Point point = (Point) other;
            return x == point.x && y == point.y;
        }

        @Override
        public int hashCode() {
            return Objects.hash(x, y);
        }
    }

    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);
        Point a = new Point(scanner.nextInt(), scanner.nextInt());
        Point b = new Point(scanner.nextInt(), scanner.nextInt());
        System.out.println(a.equals(b) ? "same" : "different");
    }
}`,
            answerWhy:
              'equals 先处理同一引用与类型检查，再比较字段；hashCode 使用同样的字段，保证 equals 相等时哈希也相等。只写 equals 会让 HashSet / HashMap 出现重复对象。',
          },
        },
        {
          id: 'c5l1-s6',
          type: 'summary',
          content: {
            points: [
              {
                kind: 'general',
                text: '**一般规则**：所有类继承 Object；默认 equals 比较身份，默认 toString 不适合展示。',
              },
              {
                kind: 'general',
                text: '**一般规则**：equals 相等 ⇒ hashCode 必须相等；hashCode 相等不保证 equals 相等。',
              },
              {
                kind: 'general',
                text: '**一般规则**：哈希容器先按 hashCode 分桶、再按 equals 确认；重写 equals 必须同时重写 hashCode。',
              },
              {
                kind: 'scenario',
                text: 'Point 展示可读 toString；BadPoint 只重写 equals，导致 HashSet 出现两个“相等”对象。',
              },
            ],
          },
        },
        {
          id: 'c5l1-s7',
          type: 'pitfall',
          content: {
            items: [
              {
                wrong: '@Override public boolean equals(Object o) { ... }\n// 没有重写 hashCode',
                why: '两个内容相等的对象哈希不同，HashSet / HashMap 会同时保留它们。',
                right: '同时重写 hashCode，使用与 equals 相同的字段。',
              },
              {
                wrong: 'public boolean equals(Point other) { ... }',
                why: '参数类型写成 Point 不是重写 Object.equals，而是重载；容器仍调用默认的身份比较。',
                right: '签名为 `public boolean equals(Object other)`，并加 @Override。',
              },
              {
                wrong: 'equals 里用 `name == other.name` 比较字符串。',
                why: '字符串 == 比较引用身份，内容相同也可能是 false。',
                right: '用 `Objects.equals(name, other.name)`。',
              },
            ],
          },
        },
      ],
    },
    {
      id: 'c5l2',
      chapter: 5,
      title: '手写 equals / hashCode 与 Objects 工具',
      summary: 'equals 按“同引用 → 类型 → 字段”逐层判断；hashCode 用相同字段计算，Objects 工具能安全处理 null。',
      steps: [
        {
          id: 'c5l2-s1',
          type: 'goal',
          content: {
            text: '你能手写出与 IDE 生成等价的 equals / hashCode，并用 Objects.equals / Objects.hash 处理 null 与多字段。',
            checklist: ['按顺序写 equals', '知道基本类型与引用类型的比较方式', '会用 Objects.hash'],
          },
        },
        {
          id: 'c5l2-s2',
          type: 'concept',
          content: {
            title: '一份可复用的手写模板',
            paragraphs: [
              'equals 的推荐顺序：同一引用直接 true → null / 类型不符返回 false → 强转 → 逐字段比较。',
              '基本类型用 `==`；引用类型用 `Objects.equals`；double 用 `Double.compare`；数组用 `Arrays.equals`。',
              'hashCode 用与 equals 相同的字段：从非零常量开始，`result = 31 * result + fieldHash`；或直接 `Objects.hash(...)`。',
              '`getClass()` 要求运行时类型完全一致；`instanceof` 允许子类也相等。选择取决于继承语义，二者不能混用。',
              '字段可变会破坏哈希容器：对象放入 HashMap 后修改参与 hashCode 的字段，就再也找不回来。',
              '与 Python 的 `__eq__` / `__hash__` 类似：重写相等逻辑时，哈希逻辑必须同步。',
            ],
            table: {
              headers: ['字段类型', 'equals 比较', 'hashCode 参与方式'],
              rows: [
                ['int / long / boolean', '`==`', '直接使用或 `Long.hashCode`'],
                ['double', '`Double.compare(a, b) == 0`', '`Double.hashCode`'],
                ['String / 对象', '`Objects.equals`', '对象自身的 hashCode'],
                ['数组', '`Arrays.equals`', '`Arrays.hashCode`'],
              ],
            },
            note: '`Objects.hash(...)` 内部就是 31 累乘；字段多时更省事，字段少时手写更直观。',
          },
        },
        {
          id: 'c5l2-s3',
          type: 'example',
          content: {
            scenarios: [
              {
                name: '场景 1：带 null 字段的 equals',
                code: `import java.util.Objects;

class Profile {
    String nickname;

    Profile(String nickname) {
        this.nickname = nickname;
    }

    @Override
    public boolean equals(Object other) {
        if (this == other) {
            return true;
        }
        if (!(other instanceof Profile)) {
            return false;
        }
        Profile profile = (Profile) other;
        return Objects.equals(nickname, profile.nickname);
    }

    @Override
    public int hashCode() {
        return Objects.hash(nickname);
    }
}

public class NullFieldDemo {
    public static void main(String[] args) {
        System.out.println(new Profile(null).equals(new Profile(null)));
        System.out.println(new Profile(null).equals(new Profile("Ada")));
    }
}`,
                output: 'true\nfalse',
                lineNotes: {
                  12: '同一引用直接返回 true，是最快的路径。',
                  15: '类型不符返回 false；也顺便排除了 null。',
                  19: '用 Objects.equals 比较字段，两边都为 null 时返回 true。',
                  24: 'hashCode 用相同字段；Objects.hash 能处理 null。',
                  30: '两个 nickname 都为 null，equals 为 true。',
                  31: 'null 与 "Ada" 不相等，返回 false。',
                },
                takeaway: '**一般规则**：引用字段一律用 Objects.equals；自己写 `a.equals(b)` 时，a 为 null 会直接抛异常。',
              },
              {
                name: '场景 2：equals + hashCode 让 Set 正确去重',
                code: `import java.util.HashSet;
import java.util.Objects;
import java.util.Set;

class Book {
    String isbn;
    String title;

    Book(String isbn, String title) {
        this.isbn = isbn;
        this.title = title;
    }

    @Override
    public boolean equals(Object other) {
        if (this == other) {
            return true;
        }
        if (!(other instanceof Book)) {
            return false;
        }
        Book book = (Book) other;
        return Objects.equals(isbn, book.isbn)
                && Objects.equals(title, book.title);
    }

    @Override
    public int hashCode() {
        return Objects.hash(isbn, title);
    }
}

public class BookSet {
    public static void main(String[] args) {
        Set<Book> books = new HashSet<>();
        books.add(new Book("978-1", "Java"));
        books.add(new Book("978-1", "Java"));
        System.out.println(books.size());
    }
}`,
                output: '1',
                lineNotes: {
                  16: '同一引用直接相等。',
                  19: '类型检查。',
                  23: '两个字段都相等才算相等。',
                  29: 'hashCode 使用与 equals 完全相同的字段。',
                  36: '两个内容相同的 Book。',
                  37: 'hashCode 相同 → 同一个桶 → 再用 equals 确认 → 只保留一个。',
                  38: '集合大小为 1。',
                },
                takeaway: '**一般规则**：equals 与 hashCode 使用同一组字段，哈希容器才能正确去重。',
              },
            ],
          },
        },
        {
          id: 'c5l2-s4',
          type: 'quiz',
          content: {
            kind: 'choice',
            question: '下面哪种 equals 实现最稳妥？',
            options: [
              '直接比较所有字段，包括用 == 比较 String',
              '先判断 same reference 与类型，再用 Objects.equals 比较引用字段',
              '只比较 hashCode',
              '用 toString 比较',
            ],
            answerIndex: 1,
            explanation:
              '先处理同一引用和类型不匹配，再逐字段比较；引用字段用 Objects.equals 处理 null。hashCode 相同不代表内容相同，toString 也不是可靠的相等判断。',
          },
        },
        {
          id: 'c5l2-s5',
          type: 'coding',
          content: {
            exerciseId: 'c5l2-item',
            task: '实现 `Item` 的 equals / hashCode（name 与 price 都相同才算相等）。读入 n 与 n 个 `name price`，用 HashSet 去重后输出集合大小。',
            io: `输入：n，随后 n 行 "name price"
输出：不同 Item 的数量
样例：输入 3 / book 10 / book 10 / pen 5 → 输出 2
约束：name 与 price 都参与相等判断。`,
            skeleton: `import java.util.HashSet;
import java.util.Objects;
import java.util.Scanner;
import java.util.Set;

public class Main {
    static class Item {
        final String name;
        final int price;

        Item(String name, int price) {
            this.name = name;
            this.price = price;
        }

        @Override
        public boolean equals(Object other) {
            // 比较 name 与 price
            return false;
        }

        @Override
        public int hashCode() {
            // 与 equals 一致
            return 0;
        }
    }

    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);
        int n = scanner.nextInt();
        Set<Item> items = new HashSet<>();
        // 读入 n 个 Item 并加入集合
        System.out.println(items.size());
    }
}`,
            hints: [
              '概念回顾：HashSet 先用 hashCode 分桶，再用 equals 确认。',
              '解题方向：equals 判断类型与两个字段；hashCode 用 Objects.hash(name, price)。',
              '关键 API：`Objects.equals`、`Objects.hash`。',
            ],
            tests: [
              {
                label: '两条重复',
                kind: 'normal',
                stdin: '3\nbook 10\nbook 10\npen 5\n',
                expectedStdout: '2\n',
              },
              {
                label: '空集合',
                kind: 'edge',
                stdin: '0\n',
                expectedStdout: '0\n',
              },
              {
                label: '同名不同价',
                kind: 'tricky',
                stdin: '2\nbook 10\nbook 20\n',
                expectedStdout: '2\n',
              },
            ],
            answer: `import java.util.HashSet;
import java.util.Objects;
import java.util.Scanner;
import java.util.Set;

public class Main {
    static class Item {
        final String name;
        final int price;

        Item(String name, int price) {
            this.name = name;
            this.price = price;
        }

        @Override
        public boolean equals(Object other) {
            if (this == other) {
                return true;
            }
            if (!(other instanceof Item)) {
                return false;
            }
            Item item = (Item) other;
            return Objects.equals(name, item.name) && price == item.price;
        }

        @Override
        public int hashCode() {
            return Objects.hash(name, price);
        }
    }

    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);
        int n = scanner.nextInt();
        Set<Item> items = new HashSet<>();
        for (int i = 0; i < n; i++) {
            items.add(new Item(scanner.next(), scanner.nextInt()));
        }
        System.out.println(items.size());
    }
}`,
            answerWhy:
              'equals 与 hashCode 使用同一组字段，HashSet 才能把内容相同的对象认成同一个元素。同名不同价的对象不相等，所以会保留两个。',
          },
        },
        {
          id: 'c5l2-s6',
          type: 'summary',
          content: {
            points: [
              {
                kind: 'general',
                text: '**一般规则**：equals 按“同引用 → 类型 → 字段”顺序判断；引用字段用 Objects.equals。',
              },
              {
                kind: 'general',
                text: '**一般规则**：hashCode 必须使用与 equals 相同的一组字段，保证相等对象哈希相同。',
              },
              {
                kind: 'general',
                text: '**一般规则**：参与 equals / hashCode 的字段应保持稳定；不要在放入哈希容器后修改它们。',
              },
              {
                kind: 'scenario',
                text: 'Profile 展示 null 字段安全比较；Book / Item 展示 equals + hashCode 让集合正确去重。',
              },
            ],
          },
        },
        {
          id: 'c5l2-s7',
          type: 'pitfall',
          content: {
            items: [
              {
                wrong: 'return name.equals(other.name) && price == other.price;',
                why: 'name 为 null 时抛 NullPointerException；other 也可能是 null。',
                right: '先做类型检查，再用 `Objects.equals(name, other.name)`。',
              },
              {
                wrong: 'equals 用 instanceof，hashCode 用 getClass 的字段，二者混用。',
                why: '相等判断与哈希口径不一致，子类场景会出现契约破坏。',
                right: '统一选择 getClass 或 instanceof，并在两者中使用同一组字段。',
              },
              {
                wrong: '把对象放进 HashSet 后再修改参与 hashCode 的字段。',
                why: '哈希值变化后，对象仍在旧的桶里，contains / remove 会找不到它。',
                right: '哈希容器中的 key 使用不可变字段，或先移除再修改再放回。',
              },
            ],
          },
        },
      ],
    },
  ],
}
