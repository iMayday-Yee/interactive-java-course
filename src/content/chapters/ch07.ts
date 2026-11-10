import type { Chapter } from '../../types/content'

export const chapter07: Chapter = {
  id: 'chapter-7',
  number: 7,
  title: '集合框架',
  subtitle: 'List 有序可重复、Set 去重、Map 按键查找；选对接口与实现，比记住所有方法更重要。',
  lessons: [
    {
      id: 'c7l1',
      chapter: 7,
      title: 'Collection / List / Set / Map 的接口层次',
      summary: 'List 有序可重复，Set 不重复，Map 是键值映射；先按“要不要顺序、要不要去重、要不要按键查找”选接口。',
      steps: [
        {
          id: 'c7l1-s1',
          type: 'goal',
          content: {
            text: '你能画出 Collection / List / Set / Map 的关系，根据需求选择接口，并把 Go 的 slice / map、Python 的 list / dict 映射过来。',
            checklist: ['知道 Map 不属于 Collection', '知道 List 与 Set 的核心差异', '会按需求选接口而不是背实现'],
          },
        },
        {
          id: 'c7l1-s2',
          type: 'concept',
          content: {
            title: '三种基本形状：序列、去重集合、键值表',
            paragraphs: [
              '`Collection` 是 List / Set / Queue 的父接口；`Map` **不是** Collection，它单独表示键值映射。',
              '`List` 有序、允许重复、可按下标访问；`ArrayList` 是默认实现，`LinkedList` 是双向链表实现。',
              '`Set` 不允许重复；`HashSet` 无序，`TreeSet` 按大小排序。',
              '`Map` 保存 key → value；key 唯一。`HashMap` 无序，`TreeMap` 按 key 排序。',
              '选型先问三件事：需要顺序吗？允许重复吗？需要按键查找吗？答案分别指向 List、Set、Map。',
              'Go 的 slice 近似 List，map 对应 Map；Python 的 list 对应 List，dict 对应 Map，set 对应 Set。',
            ],
            table: {
              headers: ['需求', 'Java 接口', '常用实现', 'Go / Python 对照'],
              rows: [
                ['有序、可重复、按下标', '`List`', '`ArrayList`', 'Go slice / Python list'],
                ['去重', '`Set`', '`HashSet` / `TreeSet`', 'Python set'],
                ['键值查找', '`Map`', '`HashMap` / `TreeMap`', 'Go map / Python dict'],
                ['先进先出队列', '`Queue` / `Deque`', '`ArrayDeque`', 'Go channel / Python deque'],
              ],
            },
            note: '面向接口编程：变量声明成 List / Set / Map，需要换实现时只改创建对象的那一行。',
          },
        },
        {
          id: 'c7l1-s3',
          type: 'example',
          content: {
            scenarios: [
              {
                name: '场景 1：List 保留重复，Set 去重',
                code: `import java.util.ArrayList;
import java.util.LinkedHashSet;
import java.util.List;
import java.util.Set;

public class ListVsSet {
    public static void main(String[] args) {
        List<String> list = new ArrayList<>();
        list.add("a");
        list.add("a");
        list.add("b");

        Set<String> set = new LinkedHashSet<>(list);
        System.out.println(list);
        System.out.println(set);
    }
}`,
                output: '[a, a, b]\n[a, b]',
                lineNotes: {
                  9: 'List 允许重复，add 两次 a 都会保留。',
                  10: '第二次 add 不会覆盖第一次。',
                  13: '用 List 构造 LinkedHashSet，去重并保留首次出现顺序。',
                  14: 'List 输出三个元素，包含重复。',
                  15: 'Set 输出两个元素，重复已被去掉。',
                },
                takeaway: '**一般规则**：需要保留重复与顺序用 List；只关心“出现过没有”用 Set。',
              },
              {
                name: '场景 2：Map 统计词频',
                code: `import java.util.HashMap;
import java.util.Map;

public class WordCount {
    public static void main(String[] args) {
        String[] words = { "java", "go", "java" };
        Map<String, Integer> counts = new HashMap<>();
        for (String word : words) {
            counts.put(word, counts.getOrDefault(word, 0) + 1);
        }
        System.out.println(counts.get("java"));
        System.out.println(counts.get("rust"));
    }
}`,
                output: '2\nnull',
                lineNotes: {
                  6: '数组里有重复单词。',
                  7: 'Map 的 key 是单词，value 是出现次数。',
                  8: '遍历每个单词。',
                  9: '`getOrDefault` 在 key 不存在时返回 0，避免空指针。',
                  11: 'java 出现 2 次。',
                  12: '不存在的 key 返回 null。',
                },
                takeaway: '**一般规则**：Map 按键查找；计数用 `getOrDefault(key, 0) + 1`，不要直接对 null 做加法。',
              },
            ],
          },
        },
        {
          id: 'c7l1-s4',
          type: 'quiz',
          content: {
            kind: 'choice',
            question: '需要“保留插入顺序，并允许重复元素”，应该选哪个接口？',
            options: ['`Set`', '`List`', '`Map`', '`Queue`'],
            answerIndex: 1,
            explanation: 'List 有序且允许重复。Set 去重；Map 是键值映射；Queue 关注出队顺序而不是按下标访问。',
          },
        },
        {
          id: 'c7l1-s5',
          type: 'coding',
          content: {
            exerciseId: 'c7l1-unique',
            task: '读入 n 个单词，输出去重后的单词数量。',
            io: `输入：n，随后 n 个单词（空白分隔）
输出：不同单词的数量
样例：输入 "3 a b a" → 输出 2
约束：n ≥ 0；只统计不同单词。`,
            skeleton: `import java.util.HashSet;
import java.util.Scanner;
import java.util.Set;

public class Main {
    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);
        int n = scanner.nextInt();
        Set<String> words = new HashSet<>();
        // 读入 n 个单词并加入集合
        System.out.println(words.size());
    }
}`,
            hints: [
              '概念回顾：Set 自动去重，size() 返回不同元素数量。',
              '解题方向：循环 n 次，把 `scanner.next()` 加入 HashSet。',
              '关键 API：`Set.add`、`Set.size`。',
            ],
            tests: [
              {
                label: '含重复单词',
                kind: 'normal',
                stdin: '4 a b a c\n',
                expectedStdout: '3\n',
              },
              {
                label: '没有单词',
                kind: 'edge',
                stdin: '0\n',
                expectedStdout: '0\n',
              },
              {
                label: '全部重复',
                kind: 'tricky',
                stdin: '3 x x x\n',
                expectedStdout: '1\n',
              },
            ],
            answer: `import java.util.HashSet;
import java.util.Scanner;
import java.util.Set;

public class Main {
    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);
        int n = scanner.nextInt();
        Set<String> words = new HashSet<>();
        for (int i = 0; i < n; i++) {
            words.add(scanner.next());
        }
        System.out.println(words.size());
    }
}`,
            answerWhy:
              'HashSet 用 equals / hashCode 判断重复，重复 add 不会改变 size。这里只需要数量，不需要顺序，所以 HashSet 足够。',
          },
        },
        {
          id: 'c7l1-s6',
          type: 'summary',
          content: {
            points: [
              {
                kind: 'general',
                text: '**一般规则**：List 有序可重复、Set 去重、Map 按键映射；Map 不属于 Collection。',
              },
              {
                kind: 'general',
                text: '**一般规则**：先按“顺序 / 去重 / 键查找”选接口，再按性能与排序需求选实现。',
              },
              {
                kind: 'general',
                text: '**一般规则**：变量声明为接口类型（List / Set / Map），实现只出现在创建对象处。',
              },
              {
                kind: 'scenario',
                text: 'List 与 Set 展示重复处理差异；Map 展示键查找与词频统计。',
              },
            ],
          },
        },
        {
          id: 'c7l1-s7',
          type: 'pitfall',
          content: {
            items: [
              {
                wrong: 'List<String> list = new ArrayList<>();\nlist.get(10);  // 只有 3 个元素',
                why: '下标越界抛 IndexOutOfBoundsException。',
                right: '用 size() 判断边界；下标范围是 0 ~ size()-1。',
              },
              {
                wrong: 'Map<String, Integer> map = new HashMap<>();\nint count = map.get("java") + 1;',
                why: 'key 不存在时 get 返回 null，自动拆箱抛 NPE。',
                right: '用 `getOrDefault(key, 0) + 1`，或先判空。',
              },
              {
                wrong: '认为 HashSet 的输出顺序稳定。',
                why: 'HashSet 不保证顺序，迭代顺序取决于哈希与容量。',
                right: '需要顺序用 LinkedHashSet（插入顺序）或 TreeSet（排序）。',
              },
            ],
          },
        },
      ],
    },
    {
      id: 'c7l2',
      chapter: 7,
      title: 'ArrayList 与 LinkedList 的复杂度',
      summary: 'ArrayList 随机访问快、尾部追加快；LinkedList 头尾操作快但随机访问慢。默认选 ArrayList。',
      steps: [
        {
          id: 'c7l2-s1',
          type: 'goal',
          content: {
            text: '你能根据操作类型选择 ArrayList 或 LinkedList，并解释下标访问、尾部追加、中间插入的复杂度差异。',
            checklist: ['知道 ArrayList 是动态数组', '知道 LinkedList 随机访问 O(n)', '知道中间插入为什么慢'],
          },
        },
        {
          id: 'c7l2-s2',
          type: 'concept',
          content: {
            title: '底层结构决定操作成本',
            paragraphs: [
              '`ArrayList` 用连续数组存储元素；按下标访问是 O(1)，尾部追加平均 O(1)，但中间插入 / 删除要移动后续元素，O(n)。',
              '`LinkedList` 用双向链表；头尾插入 / 删除是 O(1)，按下标访问必须从头或尾走，O(n)。',
              '链表每个节点额外保存前后指针，内存开销更大，缓存局部性也更差。',
              '绝大多数业务场景用 `ArrayList`；需要队列 / 栈语义时，通常优先 `ArrayDeque`，而不是 LinkedList。',
              'Go 的 slice 类似动态数组；Python 的 list 也是动态数组，随机访问快、中间插入慢。',
              '复杂度是渐近描述；元素很少时差异可能感知不到，不要为了“理论最优”牺牲可读性。',
            ],
            table: {
              headers: ['操作', 'ArrayList', 'LinkedList'],
              rows: [
                ['按下标 get(i)', 'O(1)', 'O(n)'],
                ['尾部 add', '平均 O(1)', 'O(1)'],
                ['中间 add / remove', 'O(n)', '定位 O(n)，改链 O(1)'],
                ['头部 add / remove', 'O(n)', 'O(1)'],
                ['内存', '紧凑', '每节点额外指针'],
              ],
            },
            note: 'LinkedList 的“插入 O(1)”只算改链；找到插入位置仍然要 O(n)。',
          },
        },
        {
          id: 'c7l2-s3',
          type: 'example',
          content: {
            scenarios: [
              {
                name: '场景 1：ArrayList 的下标访问与头部插入',
                code: `import java.util.ArrayList;
import java.util.List;

public class ArrayListDemo {
    public static void main(String[] args) {
        List<Integer> nums = new ArrayList<>();
        for (int i = 0; i < 5; i++) {
            nums.add(i * i);
        }
        System.out.println(nums.get(3));
        nums.add(0, -1);
        System.out.println(nums);
    }
}`,
                output: '9\n[-1, 0, 1, 4, 9]',
                lineNotes: {
                  8: '依次追加 0、1、4、9、16。',
                  10: '下标 3 对应 9，O(1) 访问。',
                  11: '在头部插入 -1；ArrayList 需要把后面元素整体后移，O(n)。',
                  12: '插入后顺序整体后移。',
                },
                takeaway: '**一般规则**：频繁按下标读取、主要在尾部追加，用 ArrayList；频繁头部插入要意识到 O(n) 成本。',
              },
              {
                name: '场景 2：LinkedList 作为双端队列',
                code: `import java.util.LinkedList;

public class LinkedListDemo {
    public static void main(String[] args) {
        LinkedList<String> queue = new LinkedList<>();
        queue.addFirst("B");
        queue.addFirst("A");
        System.out.println(queue);
        System.out.println(queue.removeLast());
        System.out.println(queue);
    }
}`,
                output: '[A, B]\nB\n[A]',
                lineNotes: {
                  5: 'LinkedList 实现 Deque，可作为双端队列。',
                  6: '从头部加入 B。',
                  7: '再从头部加入 A。',
                  9: '从尾部取出 B。',
                  10: '队列剩下 A。',
                },
                takeaway: '**一般规则**：需要头尾两端操作时用 Deque 语义；实际项目优先 ArrayDeque。',
              },
            ],
          },
        },
        {
          id: 'c7l2-s4',
          type: 'quiz',
          content: {
            kind: 'choice',
            question: '哪个实现按下标 `get(i)` 访问的平均复杂度是 O(1)？',
            options: ['`LinkedList`', '`ArrayList`', '`HashSet`', '`TreeMap`'],
            answerIndex: 1,
            explanation: 'ArrayList 底层是数组，可按偏移直接定位；LinkedList 必须沿链走到第 i 个节点。',
          },
        },
        {
          id: 'c7l2-s5',
          type: 'coding',
          content: {
            exerciseId: 'c7l2-reverse',
            task: '读入 n 个整数，存入 ArrayList，按相反顺序逐行输出。',
            io: `输入：n，随后 n 个整数
输出：倒序后的每个整数，各占一行
样例：输入 "3 1 2 3" → 输出 3 换行 2 换行 1
约束：n ≥ 1；用下标访问。`,
            skeleton: `import java.util.ArrayList;
import java.util.List;
import java.util.Scanner;

public class Main {
    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);
        int n = scanner.nextInt();
        List<Integer> nums = new ArrayList<>();
        for (int i = 0; i < n; i++) {
            nums.add(scanner.nextInt());
        }
        // 从最后一个下标走到 0
    }
}`,
            hints: [
              '概念回顾：ArrayList 支持 O(1) 下标访问，`size()-1` 是最后一个下标。',
              '解题方向：for 从 n-1 递减到 0，输出 nums.get(i)。',
              '关键 API：`List.get`、`List.size`。',
            ],
            tests: [
              {
                label: '三个数字',
                kind: 'normal',
                stdin: '3 1 2 3\n',
                expectedStdout: '3\n2\n1\n',
              },
              {
                label: '只有一个数字',
                kind: 'edge',
                stdin: '1 5\n',
                expectedStdout: '5\n',
              },
              {
                label: '含负数',
                kind: 'tricky',
                stdin: '4 -1 0 7 -2\n',
                expectedStdout: '-2\n7\n0\n-1\n',
              },
            ],
            answer: `import java.util.ArrayList;
import java.util.List;
import java.util.Scanner;

public class Main {
    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);
        int n = scanner.nextInt();
        List<Integer> nums = new ArrayList<>();
        for (int i = 0; i < n; i++) {
            nums.add(scanner.nextInt());
        }
        for (int i = n - 1; i >= 0; i--) {
            System.out.println(nums.get(i));
        }
    }
}`,
            answerWhy:
              'ArrayList 的下标访问是 O(1)，倒序循环直接 get 即可。LinkedList 也能写，但每次 get 都要走链，整体会退化为 O(n²)。',
          },
        },
        {
          id: 'c7l2-s6',
          type: 'summary',
          content: {
            points: [
              {
                kind: 'general',
                text: '**一般规则**：ArrayList = 动态数组，随机访问 O(1)；中间插入 / 删除 O(n)。',
              },
              {
                kind: 'general',
                text: '**一般规则**：LinkedList = 双向链表，头尾操作 O(1)；按下标访问 O(n)。',
              },
              {
                kind: 'general',
                text: '**一般规则**：默认用 ArrayList；需要队列 / 栈优先 ArrayDeque，而不是盲目选 LinkedList。',
              },
              {
                kind: 'scenario',
                text: 'ArrayList 展示下标读取与头部插入；LinkedList 展示双端队列操作。',
              },
            ],
          },
        },
        {
          id: 'c7l2-s7',
          type: 'pitfall',
          content: {
            items: [
              {
                wrong: 'LinkedList<String> list = new LinkedList<>();\nfor (int i = 0; i < list.size(); i++) { list.get(i); }',
                why: '每次 get 都从头走链，整体 O(n²)。',
                right: '随机访问用 ArrayList；LinkedList 用迭代器或增强 for。',
              },
              {
                wrong: '在 ArrayList 头部循环 add(0, x)。',
                why: '每次插入都要移动全部元素，整体 O(n²)。',
                right: '尾部追加；必须头部累积时考虑 Deque。',
              },
              {
                wrong: '认为 LinkedList 插入永远是 O(1)。',
                why: '只有已经定位到节点时改链才是 O(1)；查找位置仍是 O(n)。',
                right: '把定位成本算进去再选实现。',
              },
            ],
          },
        },
      ],
    },
    {
      id: 'c7l3',
      chapter: 7,
      title: 'HashSet / TreeSet 与 HashMap / TreeMap',
      summary: '哈希实现平均 O(1) 但无序、依赖 hashCode/equals；树实现有序、O(log n)，要求可比较。',
      steps: [
        {
          id: 'c7l3-s1',
          type: 'goal',
          content: {
            text: '你能在哈希实现与树实现之间做选择，解释 hashCode 对 HashMap 的影响，并知道排序集合对元素的要求。',
            checklist: ['知道 HashSet 无序', '知道 TreeSet / TreeMap 按排序规则', '知道自定义 key 必须正确实现 equals / hashCode'],
          },
        },
        {
          id: 'c7l3-s2',
          type: 'concept',
          content: {
            title: '哈希 vs 排序树',
            paragraphs: [
              '`HashSet` / `HashMap` 用哈希表：平均 O(1) 查找，不保证顺序，依赖元素的 `hashCode` 与 `equals`。',
              '`TreeSet` / `TreeMap` 用红黑树：O(log n) 查找，按自然顺序或 Comparator 排序。',
              'TreeSet 的元素必须实现 `Comparable`，或在构造时提供 `Comparator`；TreeMap 的 key 同理。',
              'HashMap 允许一个 null key；TreeMap 不允许 null key（自然排序无法比较 null）。HashSet 允许 null，TreeSet 不允许。',
              '自定义对象作为 key 时，equals / hashCode 写错会导致“放进去却查不到”，第 5 章已经演示。',
              '需要“按 key 排序遍历”用 TreeMap；只需要快速查找用 HashMap。',
            ],
            table: {
              headers: ['实现', '顺序', '查找', '对元素的要求'],
              rows: [
                ['`HashSet` / `HashMap`', '无序', '平均 O(1)', '正确实现 hashCode / equals'],
                ['`TreeSet` / `TreeMap`', '按排序规则', 'O(log n)', 'Comparable 或 Comparator'],
                ['`LinkedHashSet` / `LinkedHashMap`', '插入顺序', '平均 O(1)', '同哈希实现'],
              ],
            },
            note: '哈希实现更快，但顺序不稳定；树实现慢一点，却提供确定顺序与范围查询。',
          },
        },
        {
          id: 'c7l3-s3',
          type: 'example',
          content: {
            scenarios: [
              {
                name: '场景 1：HashSet 去重',
                code: `import java.util.HashSet;
import java.util.Set;

public class SetDedupe {
    public static void main(String[] args) {
        String[] tags = { "java", "oop", "java", "collection" };
        Set<String> unique = new HashSet<>();
        for (String tag : tags) {
            unique.add(tag);
        }
        System.out.println(unique.size());
        System.out.println(unique.contains("oop"));
    }
}`,
                output: '3\ntrue',
                lineNotes: {
                  6: '数组里有重复标签。',
                  7: 'HashSet 自动去重。',
                  9: '重复 add 不会改变集合。',
                  11: '不同标签数量是 3。',
                  12: 'contains 按 hashCode / equals 查找，平均 O(1)。',
                },
                takeaway: '**一般规则**：只需要去重与快速成员判断，用 HashSet；不要依赖它的迭代顺序。',
              },
              {
                name: '场景 2：TreeMap 按键排序输出',
                code: `import java.util.Map;
import java.util.TreeMap;

public class SortedScores {
    public static void main(String[] args) {
        TreeMap<String, Integer> scores = new TreeMap<>();
        scores.put("Bob", 80);
        scores.put("Ada", 95);
        scores.put("Cy", 70);

        for (Map.Entry<String, Integer> entry : scores.entrySet()) {
            System.out.println(entry.getKey() + "=" + entry.getValue());
        }
    }
}`,
                output: 'Ada=95\nBob=80\nCy=70',
                lineNotes: {
                  6: 'TreeMap 的 key 按自然顺序（字典序）排序。',
                  7: '插入顺序是 Bob、Ada、Cy，但遍历时不会按插入顺序。',
                  11: 'entrySet 同时拿到 key 与 value。',
                  12: '遍历结果按 key 升序输出。',
                },
                takeaway: '**一般规则**：需要按键排序或范围查询用 TreeMap；插入顺序稳定用 LinkedHashMap。',
              },
            ],
          },
        },
        {
          id: 'c7l3-s4',
          type: 'quiz',
          content: {
            kind: 'choice',
            question: '需要按 key 的字典序遍历一个 Map，应选哪个实现？',
            options: ['`HashMap`', '`TreeMap`', '`HashSet`', '`ArrayList`'],
            answerIndex: 1,
            explanation: 'TreeMap 按 key 的自然顺序或 Comparator 排序；HashMap 无序；HashSet / ArrayList 不是 Map。',
          },
        },
        {
          id: 'c7l3-s5',
          type: 'coding',
          content: {
            exerciseId: 'c7l3-sorted',
            task: '读入 n 个单词，输出去重后按字典序排序的结果，用空格连接。',
            io: `输入：n，随后 n 个单词
输出：去重并排序后的单词，空格分隔
样例：输入 "5 banana apple banana cherry apple" → 输出 apple banana cherry
约束：n ≥ 1；使用 TreeSet。`,
            skeleton: `import java.util.Scanner;
import java.util.Set;
import java.util.TreeSet;

public class Main {
    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);
        int n = scanner.nextInt();
        Set<String> words = new TreeSet<>();
        // 读入单词并加入 TreeSet
        // 输出空格连接
    }
}`,
            hints: [
              '概念回顾：TreeSet 自动去重并按自然顺序排列。',
              '解题方向：加入全部单词后遍历 TreeSet，用 StringBuilder 连接。',
              '关键 API：`TreeSet`、`String.join` 或 `StringBuilder`。',
            ],
            tests: [
              {
                label: '去重后排序',
                kind: 'normal',
                stdin: '5 banana apple banana cherry apple\n',
                expectedStdout: 'apple banana cherry\n',
              },
              {
                label: '单个单词',
                kind: 'edge',
                stdin: '1 solo\n',
                expectedStdout: 'solo\n',
              },
              {
                label: '输入本来是逆序',
                kind: 'tricky',
                stdin: '3 c b a\n',
                expectedStdout: 'a b c\n',
              },
            ],
            answer: `import java.util.Scanner;
import java.util.Set;
import java.util.TreeSet;

public class Main {
    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);
        int n = scanner.nextInt();
        Set<String> words = new TreeSet<>();
        for (int i = 0; i < n; i++) {
            words.add(scanner.next());
        }
        System.out.println(String.join(" ", words));
    }
}`,
            answerWhy:
              'TreeSet 在加入时去重，并按字典序维护顺序；遍历它即可得到排序结果。`String.join` 负责空格连接，避免末尾多空格。',
          },
        },
        {
          id: 'c7l3-s6',
          type: 'summary',
          content: {
            points: [
              {
                kind: 'general',
                text: '**一般规则**：哈希实现平均 O(1)、无序，依赖 equals / hashCode；树实现 O(log n)、有序。',
              },
              {
                kind: 'general',
                text: '**一般规则**：TreeSet / TreeMap 的元素必须可比较；不可比较会抛 ClassCastException。',
              },
              {
                kind: 'general',
                text: '**一般规则**：需要插入顺序用 LinkedHashSet / LinkedHashMap；需要排序用 Tree 实现。',
              },
              {
                kind: 'scenario',
                text: 'HashSet 展示去重与 contains；TreeMap 展示按 key 排序遍历。',
              },
            ],
          },
        },
        {
          id: 'c7l3-s7',
          type: 'pitfall',
          content: {
            items: [
              {
                wrong: '把可变对象作为 HashMap 的 key，之后修改参与 hashCode 的字段。',
                why: '哈希值变化后，对象留在旧桶，get / remove 找不到它。',
                right: 'key 使用不可变字段或不可变对象。',
              },
              {
                wrong: 'TreeSet<Person> 直接加入没有实现 Comparable 的 Person。',
                why: 'TreeSet 需要比较元素大小，运行时抛 ClassCastException。',
                right: '实现 Comparable，或给 TreeSet 传入 Comparator。',
              },
              {
                wrong: '依赖 HashMap 的遍历顺序做业务逻辑。',
                why: '顺序由哈希与容量决定，不稳定。',
                right: '需要顺序用 LinkedHashMap / TreeMap，或显式排序。',
              },
            ],
          },
        },
      ],
    },
    {
      id: 'c7l4',
      chapter: 7,
      title: '遍历方式、删除元素与集合工具',
      summary: '普通 for、增强 for、Iterator、forEach 各有适用场景；遍历中删除元素必须用 Iterator 或 removeIf。',
      steps: [
        {
          id: 'c7l4-s1',
          type: 'goal',
          content: {
            text: '你能选择合适的遍历方式，在遍历中安全删除元素，并使用 Collections / List.of 等工具。',
            checklist: ['知道增强 for 不能直接删除', '会用 Iterator.remove / removeIf', '知道 List.of 不可变'],
          },
        },
        {
          id: 'c7l4-s2',
          type: 'concept',
          content: {
            title: '遍历的四种写法',
            paragraphs: [
              '普通 `for` 适合需要下标或倒序；增强 `for` 适合只读遍历；`Iterator` 适合边遍历边删除；`forEach` 适合简单消费。',
              '增强 for 底层使用 Iterator；在循环中直接 `list.remove(...)` 会触发 `ConcurrentModificationException`。',
              '安全删除：用 `Iterator.remove()`，或用 Java 8 的 `removeIf(Predicate)`。',
              '`Collections.sort / reverse / unmodifiableList` 提供通用操作；`List.of(...)` 返回不可变列表，`Arrays.asList` 返回定长列表（不能 add / remove）。',
              '与 Go 的 range、Python 的 for 类似，遍历时修改容器都要小心迭代器失效。',
              'Stream 是更函数式的遍历与转换方式，第 11 章展开；这里先用 forEach / removeIf 建立直觉。',
            ],
            table: {
              headers: ['方式', '适合', '删除元素'],
              rows: [
                ['普通 for', '需要下标 / 倒序', '可，但要注意下标偏移'],
                ['增强 for', '只读遍历', '不可直接删除'],
                ['Iterator', '边遍历边删除', '`iterator.remove()`'],
                ['forEach / removeIf', '简单消费 / 条件删除', 'removeIf 安全'],
                ['Stream', '函数式过滤 / 转换 / 汇总', '不直接修改原集合'],
              ],
            },
            note: '“能不能删”取决于是否通过迭代器删除；容器自己修改 modCount 会让现有迭代器失效。',
          },
        },
        {
          id: 'c7l4-s3',
          type: 'example',
          content: {
            scenarios: [
              {
                name: '场景 1：Iterator 边走边删',
                code: `import java.util.ArrayList;
import java.util.Iterator;
import java.util.List;

public class IteratorDemo {
    public static void main(String[] args) {
        List<Integer> nums = new ArrayList<>(List.of(1, 2, 3, 4));
        Iterator<Integer> iterator = nums.iterator();
        while (iterator.hasNext()) {
            if (iterator.next() % 2 == 0) {
                iterator.remove();
            }
        }
        System.out.println(nums);
    }
}`,
                output: '[1, 3]',
                lineNotes: {
                  7: '用 List.of 创建初始数据，再复制进可变 ArrayList。',
                  8: '获取迭代器；迭代器负责维护遍历位置。',
                  10: '取出下一个元素并判断是否为偶数。',
                  11: '通过 iterator.remove 删除当前元素，不会破坏迭代状态。',
                  14: '只剩奇数。',
                },
                takeaway: '**一般规则**：遍历中删除用 Iterator.remove 或 removeIf；不要在增强 for 里直接调用集合的 remove。',
              },
              {
                name: '场景 2：removeIf 条件删除（Java 8+）',
                javaVersion: 'Java 8',
                code: `import java.util.ArrayList;
import java.util.List;

public class RemoveIfDemo {
    public static void main(String[] args) {
        List<String> names = new ArrayList<>(List.of("Ada", "Bob", "Amy"));
        names.removeIf(name -> !name.startsWith("A"));
        System.out.println(names);
    }
}`,
                output: '[Ada, Amy]',
                lineNotes: {
                  6: '复制成可变列表。',
                  7: 'removeIf 接收 Predicate，返回 true 的元素会被删除。',
                  8: '只剩下以 A 开头的名字。',
                },
                takeaway: '**一般规则**：条件批量删除用 removeIf，比手写 Iterator 更短且同样安全。',
              },
            ],
          },
        },
        {
          id: 'c7l4-s4',
          type: 'quiz',
          content: {
            kind: 'judge',
            statement: '在增强 for 循环中直接调用 `list.remove(item)` 删除元素是安全的。',
            answer: false,
            explanation: '增强 for 使用迭代器遍历；集合被直接修改后迭代器检测到 modCount 变化，抛 ConcurrentModificationException。',
          },
        },
        {
          id: 'c7l4-s5',
          type: 'coding',
          content: {
            exerciseId: 'c7l4-remove',
            task: '读入 n 个整数，删除所有负数，输出剩余列表的 toString 形式。',
            io: `输入：n，随后 n 个整数
输出：剩余列表，如 [4, 5]
样例：输入 "5 -1 2 -3 4 5" → 输出 [2, 4, 5]
约束：用 removeIf；n ≥ 1。`,
            skeleton: `import java.util.ArrayList;
import java.util.List;
import java.util.Scanner;

public class Main {
    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);
        int n = scanner.nextInt();
        List<Integer> nums = new ArrayList<>();
        for (int i = 0; i < n; i++) {
            nums.add(scanner.nextInt());
        }
        // 删除负数
        System.out.println(nums);
    }
}`,
            hints: [
              '概念回顾：增强 for 中直接删除会抛 ConcurrentModificationException。',
              '解题方向：用 `nums.removeIf(value -> value < 0)`。',
              '关键 API：`List.removeIf`。',
            ],
            tests: [
              {
                label: '混合正负数',
                kind: 'normal',
                stdin: '5 -1 2 -3 4 5\n',
                expectedStdout: '[2, 4, 5]\n',
              },
              {
                label: '全部是负数',
                kind: 'edge',
                stdin: '3 -1 -2 -3\n',
                expectedStdout: '[]\n',
              },
              {
                label: '只有一个正数',
                kind: 'tricky',
                stdin: '1 7\n',
                expectedStdout: '[7]\n',
              },
            ],
            answer: `import java.util.ArrayList;
import java.util.List;
import java.util.Scanner;

public class Main {
    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);
        int n = scanner.nextInt();
        List<Integer> nums = new ArrayList<>();
        for (int i = 0; i < n; i++) {
            nums.add(scanner.nextInt());
        }
        nums.removeIf(value -> value < 0);
        System.out.println(nums);
    }
}`,
            answerWhy:
              'removeIf 内部通过迭代器安全删除满足条件的元素，不需要手动维护下标或迭代器。输出直接使用 ArrayList 的 toString。',
          },
        },
        {
          id: 'c7l4-s6',
          type: 'summary',
          content: {
            points: [
              {
                kind: 'general',
                text: '**一般规则**：只读遍历用增强 for；需要下标用普通 for；遍历中删除用 Iterator.remove 或 removeIf。',
              },
              {
                kind: 'general',
                text: '**一般规则**：遍历时直接修改集合会触发 ConcurrentModificationException。',
              },
              {
                kind: 'general',
                text: '**一般规则**：List.of 不可变，Arrays.asList 定长；需要可变副本时用 `new ArrayList<>(...)`。',
              },
              {
                kind: 'scenario',
                text: 'Iterator 删除偶数；removeIf 删除非 A 开头名字，展示两种安全删除方式。',
              },
            ],
          },
        },
        {
          id: 'c7l4-s7',
          type: 'pitfall',
          content: {
            items: [
              {
                wrong: 'for (String name : names) {\n    if (name.isEmpty()) names.remove(name);\n}',
                why: '增强 for 使用的迭代器检测到集合被外部修改，抛 ConcurrentModificationException。',
                right: '用 `names.removeIf(String::isEmpty)` 或显式 Iterator。',
              },
              {
                wrong: 'List<String> fixed = Arrays.asList("a", "b");\nfixed.add("c");',
                why: 'Arrays.asList 返回定长列表，add / remove 抛 UnsupportedOperationException。',
                right: '需要可变列表用 `new ArrayList<>(Arrays.asList(...))`。',
              },
              {
                wrong: 'List<String> immutable = List.of("a");\nimmutable.set(0, "b");',
                why: 'List.of 返回不可变列表，修改操作抛 UnsupportedOperationException。',
                right: '需要修改就创建可变实现；不可变列表适合只读数据。',
              },
            ],
          },
        },
      ],
    },
  ],
}
