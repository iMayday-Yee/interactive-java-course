import type { Chapter } from '../../types/content'

export const chapter11: Chapter = {
  id: 'chapter-11',
  number: 11,
  title: 'Stream API',
  subtitle: '用声明式管道处理集合：source → 中间操作 → 终止操作。惰性求值、只能消费一次，是两个必须记住的规则。',
  lessons: [
    {
      id: 'c11l1',
      chapter: 11,
      title: 'Stream 与集合：管道与惰性',
      summary: 'Stream 是数据处理的管道，不是容器；中间操作惰性，终止操作才触发执行，一条流只能消费一次。',
      steps: [
        {
          id: 'c11l1-s1',
          type: 'goal',
          content: {
            text: '你能区分集合与流，识别中间操作与终止操作，并解释为什么没有终止操作的流不会执行。',
            checklist: ['知道 Stream 不存储数据', '知道中间操作返回新流', '知道终止操作触发执行且流不可复用'],
          },
        },
        {
          id: 'c11l1-s2',
          type: 'concept',
          content: {
            title: '管道：source → 中间操作 → 终止操作',
            paragraphs: [
              '`Stream` 不是集合，不保存元素；它描述“如何处理数据”。数据来源可以是集合、数组、`Stream.of`、`IntStream.range` 等。',
              '**中间操作**返回新的 Stream，例如 `filter`、`map`、`sorted`、`distinct`；它们**惰性**，不会立即执行。',
              '**终止操作**触发整条管道执行，例如 `collect`、`forEach`、`reduce`、`count`、`sum`；执行后流被消费，不能再次使用。',
              '流不修改原集合；它只是读取来源并产生结果。需要修改集合时用 `removeIf` 等集合 API。',
              '`stream()` 创建顺序流；`parallelStream()` 创建并行流，但并行不保证更快，也会引入线程安全问题。',
              'Go 的 range + 手写循环、Python 的列表推导/comprehension 都能表达类似处理；Java Stream 的特点是链式、惰性、可组合。',
            ],
            table: {
              headers: ['操作', '示例', '是否触发执行'],
              rows: [
                ['中间操作', '`filter` / `map` / `sorted`', '否，返回新流'],
                ['终止操作', '`collect` / `forEach` / `count`', '是'],
                ['来源', '`list.stream()` / `Stream.of`', '不适用'],
                ['复用', '同一条流再次操作', '抛 IllegalStateException'],
              ],
            },
            note: '只写中间操作、不写终止操作，代码不会报错，但什么也不会执行；这是初学者最常见的错觉。',
          },
        },
        {
          id: 'c11l1-s3',
          type: 'example',
          content: {
            scenarios: [
              {
                name: '场景 1：过滤 + 映射 + 收集',
                code: `import java.util.List;
import java.util.stream.Collectors;

public class StreamDemo {
    public static void main(String[] args) {
        List<String> names = List.of("Ada", "Bob", "Amy");
        List<String> result = names.stream()
                .filter(name -> name.startsWith("A"))
                .map(String::toUpperCase)
                .collect(Collectors.toList());
        System.out.println(result);
    }
}`,
                output: '[ADA, AMY]',
                lineNotes: {
                  6: 'List.of 创建不可变来源。',
                  7: 'stream 创建管道；后面的 filter / map 都是中间操作。',
                  8: 'filter 按条件保留元素，仍是惰性中间操作。',
                  9: 'map 把每个元素转换成大写。',
                  10: 'collect 是终止操作，触发执行；原 names 不变，result 是新列表。',
                },
                takeaway: '**一般规则**：中间操作只描述步骤，终止操作才执行；结果通常收集到新集合。',
              },
              {
                name: '场景 2：IntStream 与求和',
                code: `import java.util.stream.IntStream;

public class SumDemo {
    public static void main(String[] args) {
        int total = IntStream.rangeClosed(1, 5)
                .filter(n -> n % 2 == 1)
                .sum();
        System.out.println(total);
    }
}`,
                output: '9',
                lineNotes: {
                  5: 'rangeClosed 生成 1..5 的整数流。',
                  6: 'filter 只保留奇数。',
                  7: 'sum 是终止操作，计算 1+3+5。',
                  8: '输出 9。',
                },
                takeaway: '**一般规则**：IntStream 等原始类型流避免装箱；sum / max / average 是常用终止操作。',
              },
            ],
          },
        },
        {
          id: 'c11l1-s4',
          type: 'quiz',
          content: {
            kind: 'choice',
            question: '下面哪个是终止操作？',
            options: ['`filter`', '`map`', '`sorted`', '`collect`'],
            answerIndex: 3,
            explanation: 'filter / map / sorted 都返回新的 Stream，是中间操作；collect 触发执行并产生结果。',
          },
        },
        {
          id: 'c11l1-s5',
          type: 'coding',
          content: {
            exerciseId: 'c11l1-double',
            task: '读入 n 个整数，用 Stream 过滤出偶数、乘以 2、收集为 List，输出列表 toString。',
            io: `输入：n，随后 n 个整数
输出：处理后的列表
样例：输入 "4 1 2 3 4" → 输出 [4, 8]
约束：必须使用 stream / filter / map / collect。`,
            skeleton: `import java.util.ArrayList;
import java.util.List;
import java.util.Scanner;
import java.util.stream.Collectors;

public class Main {
    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);
        int n = scanner.nextInt();
        List<Integer> nums = new ArrayList<>();
        for (int i = 0; i < n; i++) {
            nums.add(scanner.nextInt());
        }
        List<Integer> result = nums.stream()
                // 过滤偶数并乘以 2
                .collect(Collectors.toList());
        System.out.println(result);
    }
}`,
            hints: [
              '概念回顾：filter 接收 Predicate，map 接收 Function。',
              '解题方向：`filter(x -> x % 2 == 0).map(x -> x * 2)`。',
              '关键 API：`Stream.filter`、`Stream.map`、`Collectors.toList`。',
            ],
            tests: [
              {
                label: '混合奇偶',
                kind: 'normal',
                stdin: '4 1 2 3 4\n',
                expectedStdout: '[4, 8]\n',
              },
              {
                label: '没有偶数',
                kind: 'edge',
                stdin: '2 1 3\n',
                expectedStdout: '[]\n',
              },
              {
                label: '含负数偶数',
                kind: 'tricky',
                stdin: '3 -2 0 5\n',
                expectedStdout: '[-4, 0]\n',
              },
            ],
            answer: `import java.util.ArrayList;
import java.util.List;
import java.util.Scanner;
import java.util.stream.Collectors;

public class Main {
    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);
        int n = scanner.nextInt();
        List<Integer> nums = new ArrayList<>();
        for (int i = 0; i < n; i++) {
            nums.add(scanner.nextInt());
        }
        List<Integer> result = nums.stream()
                .filter(x -> x % 2 == 0)
                .map(x -> x * 2)
                .collect(Collectors.toList());
        System.out.println(result);
    }
}`,
            answerWhy:
              'filter 保留偶数，map 生成新值，collect 触发执行并收集。原 nums 不变；流只能使用一次，所以结果必须收集下来。',
          },
        },
        {
          id: 'c11l1-s6',
          type: 'summary',
          content: {
            points: [
              {
                kind: 'general',
                text: '**一般规则**：Stream 是处理管道，不是容器；它不存储、不修改来源数据。',
              },
              {
                kind: 'general',
                text: '**一般规则**：中间操作惰性并返回新流；终止操作触发执行，且一条流只能消费一次。',
              },
              {
                kind: 'general',
                text: '**一般规则**：需要结果时用 collect / reduce / sum 等终止操作收口，否则管道不会执行。',
              },
              {
                kind: 'scenario',
                text: '过滤映射展示完整管道；IntStream 求和展示原始类型流。',
              },
            ],
          },
        },
        {
          id: 'c11l1-s7',
          type: 'pitfall',
          content: {
            items: [
              {
                wrong: '`list.stream().filter(x -> x > 0);` 之后什么都不写。',
                why: '没有终止操作，管道不会执行，也不会产生任何结果。',
                right: '补上 collect / forEach / count 等终止操作。',
              },
              {
                wrong: '把同一条流分别用于两次 collect。',
                why: '流只能消费一次，第二次操作抛 IllegalStateException。',
                right: '需要多次处理时重新创建流，或先收集成集合。',
              },
              {
                wrong: '在 forEach 里修改原集合。',
                why: '流遍历与集合修改叠加，可能导致并发修改或未定义行为。',
                right: '用集合的 removeIf，或先收集结果再替换。',
              },
            ],
          },
        },
      ],
    },
    {
      id: 'c11l2',
      chapter: 11,
      title: '常用中间操作与 reduce',
      summary: 'filter / map / flatMap / sorted / distinct / limit 组合成管道；reduce 把元素归约成一个值。',
      steps: [
        {
          id: 'c11l2-s1',
          type: 'goal',
          content: {
            text: '你能用常用中间操作组合出过滤、转换、去重、排序、截断，并用 reduce 求和、求最大值。',
            checklist: ['知道 flatMap 与 map 的区别', '知道 sorted 需要可比较元素或 Comparator', '会用 reduce 带初始值'],
          },
        },
        {
          id: 'c11l2-s2',
          type: 'concept',
          content: {
            title: '中间操作的组合',
            paragraphs: [
              '`filter(Predicate)` 保留满足条件的元素；`map(Function)` 一对一转换；`flatMap(Function)` 一对多展开后再合并。',
              '`distinct()` 按 equals / hashCode 去重；`sorted()` 使用自然顺序，`sorted(Comparator)` 使用自定义规则。',
              '`limit(n)` 截取前 n 个；`skip(n)` 跳过前 n 个；`peek` 主要用于调试，不应当作业务逻辑。',
              '`reduce(identity, accumulator)` 把流归约成一个值；`reduce(accumulator)` 返回 Optional，空流时没有结果。',
              '中间操作的顺序影响结果与性能：先 filter 再 map 通常比反过来更省；sorted / distinct 是有状态操作，可能缓冲全部元素。',
              'Stream 的遍历顺序取决于来源：List 有序，HashSet 无序；需要稳定顺序时用有序来源或 sorted。',
            ],
            table: {
              headers: ['操作', '作用', '注意'],
              rows: [
                ['`filter`', '按条件保留', 'Predicate'],
                ['`map`', '一对一转换', 'Function'],
                ['`flatMap`', '一对多展开', 'Function 返回 Stream'],
                ['`distinct`', '去重', '依赖 equals / hashCode'],
                ['`sorted`', '排序', '自然顺序或 Comparator'],
                ['`limit` / `skip`', '截断 / 跳过', '顺序流才稳定'],
              ],
            },
            note: 'reduce 的初始值必须是单位元：求和用 0，求积用 1；否则结果会偏移。',
          },
        },
        {
          id: 'c11l2-s3',
          type: 'example',
          content: {
            scenarios: [
              {
                name: '场景 1：去重、排序、收集',
                code: `import java.util.List;
import java.util.stream.Collectors;

public class DistinctDemo {
    public static void main(String[] args) {
        List<Integer> nums = List.of(3, 1, 2, 3, 2);
        List<Integer> result = nums.stream()
                .distinct()
                .sorted()
                .collect(Collectors.toList());
        System.out.println(result);
    }
}`,
                output: '[1, 2, 3]',
                lineNotes: {
                  6: '来源包含重复元素。',
                  7: 'stream 创建管道。',
                  8: 'distinct 按 equals 去重。',
                  9: 'sorted 按自然顺序排序。',
                  10: 'collect 收集为列表。',
                  11: '输出 [1, 2, 3]。',
                },
                takeaway: '**一般规则**：distinct 与 sorted 都是有状态操作；需要稳定结果时明确来源顺序或排序规则。',
              },
              {
                name: '场景 2：reduce 求和',
                code: `import java.util.List;

public class ReduceDemo {
    public static void main(String[] args) {
        int total = List.of(1, 2, 3, 4).stream()
                .reduce(0, Integer::sum);
        System.out.println(total);

        int max = List.of(4, 9, 2).stream()
                .reduce(Integer.MIN_VALUE, Math::max);
        System.out.println(max);
    }
}`,
                output: '10\n9',
                lineNotes: {
                  5: '整数列表作为来源。',
                  6: '初始值 0；Integer::sum 把当前累计值与元素相加。',
                  7: '输出 10。',
                  9: '求最大值时，初始值取类型的最小值。',
                  10: 'Math::max 是二元累加器。',
                  11: '输出 9。',
                },
                takeaway: '**一般规则**：reduce 用初始值 + 二元操作；初始值必须是单位元，否则会污染结果。',
              },
            ],
          },
        },
        {
          id: 'c11l2-s4',
          type: 'quiz',
          content: {
            kind: 'choice',
            question: '需要把 `List<List<Integer>>` 展平成一个整数流，应该用哪个操作？',
            options: ['`map(List::size)`', '`flatMap(List::stream)`', '`filter(List::isEmpty)`', '`reduce(List::add)`'],
            answerIndex: 1,
            explanation: 'flatMap 把每个元素映射成一个 Stream，再把这些 Stream 合并成一个流；map 只会得到 Stream 的流。',
          },
        },
        {
          id: 'c11l2-s5',
          type: 'coding',
          content: {
            exerciseId: 'c11l2-words',
            task: '读入 n 个单词，去重并按字典序排序，用空格连接输出。',
            io: `输入：n，随后 n 个单词
输出：去重排序后的单词
样例：输入 "4 b a b c" → 输出 a b c
约束：使用 stream / distinct / sorted / collect。`,
            skeleton: `import java.util.ArrayList;
import java.util.List;
import java.util.Scanner;
import java.util.stream.Collectors;

public class Main {
    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);
        int n = scanner.nextInt();
        List<String> words = new ArrayList<>();
        for (int i = 0; i < n; i++) {
            words.add(scanner.next());
        }
        String result = words.stream()
                // 去重、排序并连接
                .collect(Collectors.joining(" "));
        System.out.println(result);
    }
}`,
            hints: [
              '概念回顾：distinct 去重，sorted 排序，joining 连接。',
              '解题方向：`distinct().sorted().collect(Collectors.joining(" "))`。',
              '关键 API：`Stream.distinct`、`Stream.sorted`、`Collectors.joining`。',
            ],
            tests: [
              {
                label: '含重复',
                kind: 'normal',
                stdin: '4 b a b c\n',
                expectedStdout: 'a b c\n',
              },
              {
                label: '只有一个词',
                kind: 'edge',
                stdin: '1 solo\n',
                expectedStdout: 'solo\n',
              },
              {
                label: '输入逆序',
                kind: 'tricky',
                stdin: '3 c b a\n',
                expectedStdout: 'a b c\n',
              },
            ],
            answer: `import java.util.ArrayList;
import java.util.List;
import java.util.Scanner;
import java.util.stream.Collectors;

public class Main {
    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);
        int n = scanner.nextInt();
        List<String> words = new ArrayList<>();
        for (int i = 0; i < n; i++) {
            words.add(scanner.next());
        }
        String result = words.stream()
                .distinct()
                .sorted()
                .collect(Collectors.joining(" "));
        System.out.println(result);
    }
}`,
            answerWhy:
              'distinct 去重，sorted 按字典序排序，joining 负责空格连接。顺序不能颠倒：先排序再去重结果相同，但语义上先去重更自然。',
          },
        },
        {
          id: 'c11l2-s6',
          type: 'summary',
          content: {
            points: [
              {
                kind: 'general',
                text: '**一般规则**：filter 保留、map 转换、flatMap 展平、distinct 去重、sorted 排序，都是中间操作。',
              },
              {
                kind: 'general',
                text: '**一般规则**：reduce 把流归约成单个值；初始值必须是单位元，空流要特别处理。',
              },
              {
                kind: 'general',
                text: '**一般规则**：操作顺序影响性能与语义；先缩小数据量再转换通常更高效。',
              },
              {
                kind: 'scenario',
                text: 'distinct + sorted 展示有状态中间操作；reduce 展示求和与最大值。',
              },
            ],
          },
        },
        {
          id: 'c11l2-s7',
          type: 'pitfall',
          content: {
            items: [
              {
                wrong: '用 `map(List::stream)` 试图展平 `List<List<Integer>>`。',
                why: 'map 生成的是 Stream<Stream<Integer>>，没有展平。',
                right: '用 `flatMap(List::stream)`。',
              },
              {
                wrong: 'reduce 求和时初始值写成 1。',
                why: '每个流的结果都会额外加 1，总和偏移。',
                right: '求和初始值用 0。',
              },
              {
                wrong: '在无序来源上依赖 limit / findFirst 的稳定性。',
                why: 'HashSet 等来源没有稳定顺序，截取结果可能变化。',
                right: '需要稳定顺序时先 sorted 或使用有序来源。',
              },
            ],
          },
        },
      ],
    },
    {
      id: 'c11l3',
      chapter: 11,
      title: 'Collectors：toList、toMap 与 groupingBy',
      summary: 'collect 是通用终止操作；Collectors 提供收集策略：列表、映射、分组、连接、计数。',
      steps: [
        {
          id: 'c11l3-s1',
          type: 'goal',
          content: {
            text: '你能用 Collectors.toList / toMap / groupingBy / joining 收集结果，并处理重复 key 与分组后的下游收集器。',
            checklist: ['知道 groupingBy 的三个参数', '知道 toMap 遇到重复 key 会抛异常', '会用 joining 连接字符串'],
          },
        },
        {
          id: 'c11l3-s2',
          type: 'concept',
          content: {
            title: '收集器决定结果形状',
            paragraphs: [
              '`Collectors.toList()` 收集为 List；`toSet()` 收集为 Set；`toMap(keyMapper, valueMapper)` 收集为 Map。',
              '`toMap` 遇到重复 key 会抛 IllegalStateException；需要合并时提供第三个参数 `(oldValue, newValue) -> ...`。',
              '`groupingBy(classifier)` 按分类函数分组，结果是 `Map<K, List<T>>`；第二个参数可指定 Map 实现，第三个参数指定下游收集器。',
              '常用下游收集器：`counting()` 计数、`mapping()` 转换、`joining()` 连接、`summingInt()` 求和。',
              '`joining(delimiter, prefix, suffix)` 可以生成带分隔符与前后缀的字符串。',
              'HashMap 分组结果的遍历顺序不稳定；需要稳定输出时用 TreeMap 作为分组 Map，或在输出前排序。',
            ],
            table: {
              headers: ['收集器', '结果', '说明'],
              rows: [
                ['`toList()`', 'List', '保留顺序'],
                ['`toSet()`', 'Set', '去重'],
                ['`toMap(k, v)`', 'Map', '重复 key 抛异常'],
                ['`groupingBy(f)`', 'Map<K, List<T>>', '默认 HashMap'],
                ['`joining(d)`', 'String', '连接元素'],
                ['`counting()`', 'Long', '下游计数'],
              ],
            },
            note: 'groupingBy 的结果默认是 HashMap；需要按 key 排序时传入 `TreeMap::new`。',
          },
        },
        {
          id: 'c11l3-s3',
          type: 'example',
          content: {
            scenarios: [
              {
                name: '场景 1：按长度分组',
                code: `import java.util.List;
import java.util.Map;
import java.util.TreeMap;
import java.util.stream.Collectors;
import java.util.stream.Stream;

public class GroupDemo {
    public static void main(String[] args) {
        Map<Integer, List<String>> byLength = Stream.of(
                "java", "go", "c", "rust", "ui")
                .collect(Collectors.groupingBy(
                        String::length,
                        TreeMap::new,
                        Collectors.toList()));
        System.out.println(byLength);
    }
}`,
                output: '{1=[c], 2=[go, ui], 4=[java, rust]}',
                lineNotes: {
                  9: '目标是按长度分组的 Map。',
                  10: '来源是五个字符串。',
                  11: 'collect 使用 groupingBy 按分类函数分组。',
                  12: '分类函数：String::length。',
                  13: '使用 TreeMap，保证按 key 升序输出。',
                  14: '下游收集器把同组元素收成 List。',
                  15: '结果按长度分组，组内保持流顺序。',
                },
                takeaway: '**一般规则**：groupingBy(分类, Map 工厂, 下游收集器) 可以控制分组结果的结构与顺序。',
              },
              {
                name: '场景 2：joining 与 toMap',
                code: `import java.util.Map;
import java.util.TreeMap;
import java.util.stream.Collectors;
import java.util.stream.Stream;

public class CollectDemo {
    public static void main(String[] args) {
        String joined = Stream.of("a", "b", "c")
                .collect(Collectors.joining(","));
        System.out.println(joined);

        Map<String, Integer> lengths = Stream.of("java", "go")
                .collect(Collectors.toMap(
                        word -> word,
                        String::length,
                        (oldValue, newValue) -> oldValue,
                        TreeMap::new));
        System.out.println(lengths);
    }
}`,
                output: 'a,b,c\n{go=2, java=4}',
                lineNotes: {
                  8: '三个字符串。',
                  9: 'joining 用逗号连接，没有前缀后缀。',
                  10: '输出 a,b,c。',
                  13: '单词作为 key，长度作为 value。',
                  14: 'keyMapper 与 valueMapper。',
                  15: '合并函数：重复 key 时保留旧值（这里其实没有重复）。',
                  16: 'TreeMap 保证按 key 排序输出。',
                },
                takeaway: '**一般规则**：toMap 必须考虑重复 key；groupingBy 用 TreeMap 可获得稳定顺序。',
              },
            ],
          },
        },
        {
          id: 'c11l3-s4',
          type: 'quiz',
          content: {
            kind: 'choice',
            question: '`Collectors.groupingBy(String::length)` 的结果类型是？',
            options: ['`Map<Integer, String>`', '`Map<Integer, List<String>>`', '`List<Map<Integer, String>>`', '`Set<String>`'],
            answerIndex: 1,
            explanation: '默认下游收集器是 toList，所以每个 key 对应一个 List；需要其他形状时传第三个参数。',
          },
        },
        {
          id: 'c11l3-s5',
          type: 'coding',
          content: {
            exerciseId: 'c11l3-group',
            task: '读入 n 个单词，按首字母分组计数，按字母顺序输出 `a=2,b=1` 的形式。',
            io: `输入：n，随后 n 个单词
输出：首字母=数量，逗号分隔，按字母排序
样例：输入 "3 apple ant banana" → 输出 a=2,b=1
约束：使用 groupingBy + counting，并用 TreeMap 保证顺序。`,
            skeleton: `import java.util.Map;
import java.util.Scanner;
import java.util.TreeMap;
import java.util.stream.Collectors;

public class Main {
    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);
        int n = scanner.nextInt();
        java.util.List<String> words = new java.util.ArrayList<>();
        for (int i = 0; i < n; i++) {
            words.add(scanner.next());
        }
        Map<String, Long> counts = new TreeMap<>();
        // 用 groupingBy + counting 填充 counts
        String result = counts.entrySet().stream()
                .map(entry -> entry.getKey() + "=" + entry.getValue())
                .collect(Collectors.joining(","));
        System.out.println(result);
    }
}`,
            hints: [
              '概念回顾：groupingBy 默认收集成 List，counting 下游收集器返回数量。',
              '解题方向：`groupingBy(w -> w.substring(0,1), TreeMap::new, counting())`。',
              '关键 API：`Collectors.groupingBy`、`Collectors.counting`。',
            ],
            tests: [
              {
                label: '两个首字母',
                kind: 'normal',
                stdin: '3 apple ant banana\n',
                expectedStdout: 'a=2,b=1\n',
              },
              {
                label: '只有一个词',
                kind: 'edge',
                stdin: '1 solo\n',
                expectedStdout: 's=1\n',
              },
              {
                label: '全部同首字母',
                kind: 'tricky',
                stdin: '3 ant apple axe\n',
                expectedStdout: 'a=3\n',
              },
            ],
            answer: `import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.Scanner;
import java.util.TreeMap;
import java.util.stream.Collectors;

public class Main {
    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);
        int n = scanner.nextInt();
        List<String> words = new ArrayList<>();
        for (int i = 0; i < n; i++) {
            words.add(scanner.next());
        }
        Map<String, Long> counts = words.stream()
                .collect(Collectors.groupingBy(
                        word -> word.substring(0, 1),
                        TreeMap::new,
                        Collectors.counting()));
        String result = counts.entrySet().stream()
                .map(entry -> entry.getKey() + "=" + entry.getValue())
                .collect(Collectors.joining(","));
        System.out.println(result);
    }
}`,
            answerWhy:
              'groupingBy 用首字母分类，TreeMap 保证 key 有序，counting 统计每组的数量。最后把 entry 转成 `key=value` 并用逗号连接，输出稳定。',
          },
        },
        {
          id: 'c11l3-s6',
          type: 'summary',
          content: {
            points: [
              {
                kind: 'general',
                text: '**一般规则**：collect 是通用终止操作；Collectors 决定结果形状。',
              },
              {
                kind: 'general',
                text: '**一般规则**：toMap 要处理重复 key；groupingBy 用 TreeMap 获得稳定顺序。',
              },
              {
                kind: 'general',
                text: '**一般规则**：groupingBy 的第三个参数是下游收集器，可计数、映射、连接或求和。',
              },
              {
                kind: 'scenario',
                text: '按长度分组展示三参数 groupingBy；joining / toMap 展示字符串与映射收集。',
              },
            ],
          },
        },
        {
          id: 'c11l3-s7',
          type: 'pitfall',
          content: {
            items: [
              {
                wrong: '`toMap(Item::getName, Item::getPrice)` 时遇到同名商品。',
                why: '重复 key 会抛 IllegalStateException。',
                right: '提供合并函数，或改用 groupingBy。',
              },
              {
                wrong: '依赖分组结果 HashMap 的遍历顺序输出。',
                why: 'HashMap 顺序不稳定，结果可能随版本或数据变化。',
                right: 'groupingBy 传 TreeMap::new，或在输出前排序。',
              },
              {
                wrong: '把 groupingBy 的第二个参数当成下游收集器。',
                why: '第二个参数是 Map 工厂；下游收集器是第三个参数。',
                right: '按 `groupingBy(classifier, mapFactory, downstream)` 的位置传参。',
              },
            ],
          },
        },
      ],
    },
  ],
}
