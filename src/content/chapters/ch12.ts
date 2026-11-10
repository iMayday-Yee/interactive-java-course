import type { Chapter } from '../../types/content'

export const chapter12: Chapter = {
  id: 'chapter-12',
  number: 12,
  title: '多线程基础',
  subtitle: 'Thread / Runnable / Callable / Future、竞态条件与 synchronized、线程池。先建立“共享可变状态必须同步”的直觉。',
  lessons: [
    {
      id: 'c12l1',
      chapter: 12,
      title: 'Thread、Runnable、Callable 与 Future',
      summary: 'start 启动新线程，run 只是普通方法调用；Callable 有返回值，Future 用来取回异步结果。',
      steps: [
        {
          id: 'c12l1-s1',
          type: 'goal',
          content: {
            text: '你能创建并启动线程，解释 start 与 run 的区别，用 join 等待线程结束，并通过 Callable + Future 获取异步结果。',
            checklist: ['知道 start 才会创建新线程', '知道 join 的作用', '知道 Future.get 会阻塞'],
          },
        },
        {
          id: 'c12l1-s2',
          type: 'concept',
          content: {
            title: '线程是执行流',
            paragraphs: [
              '进程拥有独立内存；线程共享进程内存。创建线程意味着多一条执行流，可能并发访问同一份数据。',
              '实现线程的两种方式：继承 `Thread` 并重写 `run`，或实现 `Runnable` 并交给 Thread。优先 Runnable，避免占用唯一的继承位置。',
              '**start()** 才创建新线程并调用 run；直接调用 **run()** 只是当前线程里的普通方法调用。',
              '`join()` 让当前线程等待目标线程结束；主线程常用它来确保子线程完成后再读取结果。',
              '`Callable<V>` 的 `call()` 有返回值、可以抛受检异常；`Future<V>` 代表未来结果，`get()` 会阻塞直到完成，失败时抛 ExecutionException。',
              '线程调度不确定：不要依赖线程的执行先后顺序，除非用 join / 同步机制显式建立顺序。',
            ],
            table: {
              headers: ['写法', '返回值', '启动方式', '适用'],
              rows: [
                ['`Runnable`', '无', '`new Thread(r).start()`', '只执行动作'],
                ['`Thread` 子类', '无', '`start()`', '不推荐占用继承'],
                ['`Callable<V>`', '有', '`ExecutorService.submit`', '需要结果或异常'],
                ['`Future<V>`', '有', '`submit` 返回', '取异步结果'],
              ],
            },
            note: '直接调用 `run()` 是初学者最常见的错误：它不会创建新线程，代码仍在当前线程顺序执行。',
          },
        },
        {
          id: 'c12l1-s3',
          type: 'example',
          content: {
            scenarios: [
              {
                name: '场景 1：start 与 join',
                code: `public class ThreadDemo {
    public static void main(String[] args) throws InterruptedException {
        Thread worker = new Thread(() -> System.out.println("worker"));
        worker.start();
        worker.join();
        System.out.println("main");
    }
}`,
                output: 'worker\nmain',
                lineNotes: {
                  3: '用 lambda 实现 Runnable，线程体只打印一行。',
                  4: 'start 创建新线程；不要写 run()。',
                  5: '主线程等待 worker 结束，保证输出顺序稳定。',
                  6: 'worker 完成后主线程继续。',
                },
                takeaway: '**一般规则**：start 启动并发执行；join 建立“等待完成”的顺序，不能靠 sleep 猜时间。',
              },
              {
                name: '场景 2：Callable 与 Future',
                code: `import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;
import java.util.concurrent.Future;

public class FutureDemo {
    public static void main(String[] args) throws Exception {
        ExecutorService pool = Executors.newSingleThreadExecutor();
        Future<Integer> future = pool.submit(() -> 6 * 7);
        System.out.println(future.get());
        pool.shutdown();
    }
}`,
                output: '42',
                lineNotes: {
                  7: '单线程池负责执行任务。',
                  8: 'submit 接收 Callable，返回 Future。',
                  9: 'get 阻塞等待结果；任务失败会抛 ExecutionException。',
                  10: 'shutdown 让线程池停止接收新任务并最终退出。',
                },
                takeaway: '**一般规则**：需要返回值用 Callable + Future；get 会阻塞，调用方要清楚等待成本。',
              },
            ],
          },
        },
        {
          id: 'c12l1-s4',
          type: 'quiz',
          content: {
            kind: 'choice',
            question: '直接调用 `thread.run()` 而不是 `thread.start()` 会发生什么？',
            options: [
              '创建新线程并执行 run',
              '在当前线程中同步执行 run，没有新线程',
              '编译错误',
              '线程永远不执行',
            ],
            answerIndex: 1,
            explanation: 'run 只是普通方法；start 才创建新线程。直接 run 会让代码在当前线程顺序执行。',
          },
        },
        {
          id: 'c12l1-s5',
          type: 'coding',
          content: {
            exerciseId: 'c12l1-sum',
            task: '用单线程 ExecutorService 提交两个 Callable，分别返回读入的两个整数，取回后输出和。',
            io: `输入：两个整数
输出：它们的和
样例：输入 2 3 → 输出 5
约束：必须使用 Callable + Future，并关闭线程池。`,
            skeleton: `import java.util.Scanner;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;
import java.util.concurrent.Future;

public class Main {
    public static void main(String[] args) throws Exception {
        Scanner scanner = new Scanner(System.in);
        int a = scanner.nextInt();
        int b = scanner.nextInt();
        ExecutorService pool = Executors.newSingleThreadExecutor();
        Future<Integer> first = pool.submit(() -> a);
        Future<Integer> second = pool.submit(() -> b);
        // 取回并求和
        pool.shutdown();
    }
}`,
            hints: [
              '概念回顾：Future.get 阻塞等待 Callable 的返回值。',
              '解题方向：`first.get() + second.get()`。',
              '关键 API：`Future.get`、`ExecutorService.shutdown`。',
            ],
            tests: [
              {
                label: '正整数',
                kind: 'normal',
                stdin: '2 3\n',
                expectedStdout: '5\n',
              },
              {
                label: '两个 0',
                kind: 'edge',
                stdin: '0 0\n',
                expectedStdout: '0\n',
              },
              {
                label: '含负数',
                kind: 'tricky',
                stdin: '-2 5\n',
                expectedStdout: '3\n',
              },
            ],
            answer: `import java.util.Scanner;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;
import java.util.concurrent.Future;

public class Main {
    public static void main(String[] args) throws Exception {
        Scanner scanner = new Scanner(System.in);
        int a = scanner.nextInt();
        int b = scanner.nextInt();
        ExecutorService pool = Executors.newSingleThreadExecutor();
        Future<Integer> first = pool.submit(() -> a);
        Future<Integer> second = pool.submit(() -> b);
        System.out.println(first.get() + second.get());
        pool.shutdown();
    }
}`,
            answerWhy:
              '两个任务在同一个单线程池中顺序执行；get 取回各自结果后相加。shutdown 让线程池优雅结束，避免程序挂住。',
          },
        },
        {
          id: 'c12l1-s6',
          type: 'summary',
          content: {
            points: [
              {
                kind: 'general',
                text: '**一般规则**：start 创建新线程，run 只是普通方法；等待线程完成用 join。',
              },
              {
                kind: 'general',
                text: '**一般规则**：需要返回值或受检异常用 Callable + Future；get 会阻塞。',
              },
              {
                kind: 'general',
                text: '**一般规则**：线程调度不确定；顺序要靠 join / 同步 / Future 显式建立。',
              },
              {
                kind: 'scenario',
                text: 'Thread + join 展示执行流与等待；Future 展示异步结果。',
              },
            ],
          },
        },
        {
          id: 'c12l1-s7',
          type: 'pitfall',
          content: {
            items: [
              {
                wrong: 'Thread t = new Thread(() -> System.out.println("x"));\nt.run();',
                why: '没有创建新线程，run 在当前线程同步执行。',
                right: 't.start();',
              },
              {
                wrong: '用 `Thread.sleep(100)` 猜测子线程已经完成。',
                why: '耗时不确定，慢机器上会读到未完成状态。',
                right: '用 `join()` 或同步机制等待确定的完成信号。',
              },
              {
                wrong: '提交 Future 后不调用 get，也不 shutdown 线程池。',
                why: '程序可能一直挂着；任务异常也可能被静默丢弃。',
                right: '取回结果并处理异常，最后 shutdown。',
              },
            ],
          },
        },
      ],
    },
    {
      id: 'c12l2',
      chapter: 12,
      title: '竞态条件与 synchronized',
      summary: '多个线程读写同一份可变状态会产生竞态；synchronized 提供互斥与可见性，AtomicInteger 提供原子操作。',
      steps: [
        {
          id: 'c12l2-s1',
          type: 'goal',
          content: {
            text: '你能解释 value++ 为什么不是原子操作，用 synchronized 保护共享状态，并知道 volatile 只保证可见性。',
            checklist: ['知道竞态条件是什么', '知道 synchronized 锁对象', '知道 volatile 不等于原子性'],
          },
        },
        {
          id: 'c12l2-s2',
          type: 'concept',
          content: {
            title: '共享可变状态的危险',
            paragraphs: [
              '`value++` 看似一步，实际包含“读取 → 加一 → 写回”三个动作；两个线程可能交错执行，导致丢失更新。',
              '**竞态条件**：结果依赖线程调度顺序，同一段代码多次运行可能得到不同结果。',
              '`synchronized` 提供互斥：同一时刻只有一个线程能进入被保护的代码；退出时还会把修改刷新到主内存，提供可见性。',
              '同步实例方法锁定 `this`；同步静态方法锁定 Class 对象；同步块 `synchronized (lock) { ... }` 锁定指定对象。',
              '`AtomicInteger` 用 CAS 提供原子自增，适合简单计数；`volatile` 只保证可见性与有序性，不保证复合操作原子性。',
              '锁要保护同一份状态就必须使用同一个锁对象；锁不同等于没锁。',
            ],
            table: {
              headers: ['机制', '保证', '不保证'],
              rows: [
                ['`synchronized`', '互斥 + 可见性', '不自动提升性能'],
                ['`AtomicInteger`', '单变量原子操作', '多个变量组合的原子性'],
                ['`volatile`', '可见性 + 禁止部分重排', '`count++` 的原子性'],
                ['普通字段', '无', '并发安全'],
              ],
            },
            note: '不要用 `Thread.sleep` 或运气来“避免竞态”；正确性必须由同步机制保证。',
          },
        },
        {
          id: 'c12l2-s3',
          type: 'example',
          content: {
            scenarios: [
              {
                name: '场景 1：synchronized 计数器',
                code: `class Counter {
    private int value;

    synchronized void increment() {
        value++;
    }

    synchronized int value() {
        return value;
    }
}

public class SyncDemo {
    public static void main(String[] args) throws InterruptedException {
        Counter counter = new Counter();
        Thread[] threads = new Thread[4];
        for (int i = 0; i < threads.length; i++) {
            threads[i] = new Thread(() -> {
                for (int j = 0; j < 1000; j++) {
                    counter.increment();
                }
            });
            threads[i].start();
        }
        for (Thread thread : threads) {
            thread.join();
        }
        System.out.println(counter.value());
    }
}`,
                output: '4000',
                lineNotes: {
                  4: '同步实例方法锁定 this；同一时刻只有一个线程能进入。',
                  5: '读-加-写被互斥保护，不会丢失更新。',
                  8: '读取也同步，保证看到最新值。',
                  16: '四个线程共享同一个 Counter 对象。',
                  19: '每个线程执行 1000 次自增。',
                  25: '主线程等待全部线程结束。',
                  28: '最终一定是 4000。',
                },
                takeaway: '**一般规则**：共享可变状态必须用同一个锁保护；锁的范围要覆盖完整的读-改-写。',
              },
              {
                name: '场景 2：AtomicInteger',
                code: `import java.util.concurrent.atomic.AtomicInteger;

public class AtomicDemo {
    public static void main(String[] args) throws InterruptedException {
        AtomicInteger count = new AtomicInteger();
        Thread[] threads = new Thread[2];
        for (int i = 0; i < threads.length; i++) {
            threads[i] = new Thread(() -> {
                for (int j = 0; j < 1000; j++) {
                    count.incrementAndGet();
                }
            });
            threads[i].start();
        }
        for (Thread thread : threads) {
            thread.join();
        }
        System.out.println(count.get());
    }
}`,
                output: '2000',
                lineNotes: {
                  5: 'AtomicInteger 提供原子的读改写操作。',
                  10: 'incrementAndGet 是原子操作，不需要额外 synchronized。',
                  16: '等待两个线程完成。',
                  18: '结果是 2000。',
                },
                takeaway: '**一般规则**：单个变量的原子计数用 AtomicInteger；多个状态组合仍需锁或更高层同步。',
              },
            ],
          },
        },
        {
          id: 'c12l2-s4',
          type: 'quiz',
          content: {
            kind: 'choice',
            question: '两个线程各自使用不同的锁对象保护同一个静态计数器，会发生什么？',
            options: [
              '仍然安全，因为都用了 synchronized',
              '两个线程互不排斥，仍可能丢失更新',
              '编译错误',
              '自动变成 AtomicInteger',
            ],
            answerIndex: 1,
            explanation: '互斥的前提是使用同一个锁对象；锁不同，两个线程可以同时进入各自的同步块。',
          },
        },
        {
          id: 'c12l2-s5',
          type: 'coding',
          content: {
            exerciseId: 'c12l2-counter',
            task: '读入线程数 n 和每个线程的自增次数 m，用 synchronized 计数器并发累加，等待全部线程结束后输出总数。',
            io: `输入：两个整数（线程数 n、每线程次数 m）
输出：n × m
样例：输入 4 1000 → 输出 4000
约束：共享计数器必须用 synchronized 保护；主线程 join 全部线程。`,
            skeleton: `import java.util.Scanner;

public class Main {
    static class Counter {
        private int value;

        synchronized void increment() {
            value++;
        }

        synchronized int value() {
            return value;
        }
    }

    public static void main(String[] args) throws InterruptedException {
        Scanner scanner = new Scanner(System.in);
        int n = scanner.nextInt();
        int m = scanner.nextInt();
        Counter counter = new Counter();
        Thread[] threads = new Thread[n];
        // 创建并启动 n 个线程，每个自增 m 次
        // join 全部线程后输出 counter.value()
    }
}`,
            hints: [
              '概念回顾：共享 counter 必须用同一个锁对象保护。',
              '解题方向：每个线程循环 m 次调用 increment；启动后逐个 join。',
              '关键 API：`Thread.start`、`Thread.join`。',
            ],
            tests: [
              {
                label: '四个线程',
                kind: 'normal',
                stdin: '4 1000\n',
                expectedStdout: '4000\n',
              },
              {
                label: '单线程',
                kind: 'edge',
                stdin: '1 1000\n',
                expectedStdout: '1000\n',
              },
              {
                label: '八线程五百次',
                kind: 'tricky',
                stdin: '8 500\n',
                expectedStdout: '4000\n',
              },
            ],
            answer: `import java.util.Scanner;

public class Main {
    static class Counter {
        private int value;

        synchronized void increment() {
            value++;
        }

        synchronized int value() {
            return value;
        }
    }

    public static void main(String[] args) throws InterruptedException {
        Scanner scanner = new Scanner(System.in);
        int n = scanner.nextInt();
        int m = scanner.nextInt();
        Counter counter = new Counter();
        Thread[] threads = new Thread[n];
        for (int i = 0; i < n; i++) {
            threads[i] = new Thread(() -> {
                for (int j = 0; j < m; j++) {
                    counter.increment();
                }
            });
            threads[i].start();
        }
        for (Thread thread : threads) {
            thread.join();
        }
        System.out.println(counter.value());
    }
}`,
            answerWhy:
              '所有线程共享同一个 Counter 实例，increment 用 synchronized 保护读改写；join 确保主线程在所有自增完成后才读取结果，因此输出稳定是 n × m。',
          },
        },
        {
          id: 'c12l2-s6',
          type: 'summary',
          content: {
            points: [
              {
                kind: 'general',
                text: '**一般规则**：多线程读写共享可变状态会产生竞态；value++ 不是原子操作。',
              },
              {
                kind: 'general',
                text: '**一般规则**：synchronized 提供互斥与可见性；必须用同一个锁保护同一份状态。',
              },
              {
                kind: 'general',
                text: '**一般规则**：volatile 只保证可见性；单变量原子计数用 AtomicInteger 更直接。',
              },
              {
                kind: 'scenario',
                text: 'synchronized 计数器与 AtomicInteger 都展示了“结果确定”的并发累加。',
              },
            ],
          },
        },
        {
          id: 'c12l2-s7',
          type: 'pitfall',
          content: {
            items: [
              {
                wrong: '多线程直接 `count++`，没有同步。',
                why: '读改写交错，可能丢失更新，结果小于预期。',
                right: '用 synchronized 保护，或 AtomicInteger。',
              },
              {
                wrong: '用 volatile 修饰 int 后直接 count++。',
                why: 'volatile 只保证可见性，count++ 仍是复合操作。',
                right: 'volatile 适合状态标志；计数用 AtomicInteger / 锁。',
              },
              {
                wrong: '同步块里锁的是局部新建对象。',
                why: '每个线程锁自己的对象，互不排斥。',
                right: '锁定所有线程共享的同一个对象。',
              },
            ],
          },
        },
      ],
    },
    {
      id: 'c12l3',
      chapter: 12,
      title: '线程池与 Go goroutine 的模型差异',
      summary: '线程池复用线程、限制并发；Java 平台线程与 OS 线程一一对应，Go goroutine 是 M:N 调度。',
      steps: [
        {
          id: 'c12l3-s1',
          type: 'goal',
          content: {
            text: '你能用 Executors 创建固定线程池、提交任务并汇总结果，并解释线程池复用线程的意义。',
            checklist: ['知道 newFixedThreadPool 的作用', '会 submit Callable 并 get', '知道 shutdown 的必要性'],
          },
        },
        {
          id: 'c12l3-s2',
          type: 'concept',
          content: {
            title: '复用线程，控制并发',
            paragraphs: [
              '频繁创建 / 销毁线程成本高；线程池维护一组工作线程，复用它们执行任务。',
              '`Executors.newFixedThreadPool(n)` 创建固定大小线程池；`submit` 提交 Runnable / Callable，返回 Future。',
              '`invokeAll` 批量提交并等待全部完成，返回与任务顺序一致的 Future 列表。',
              '`shutdown()` 停止接收新任务，等待已提交任务完成；`shutdownNow()` 尝试中断正在执行的任务。',
              '线程池大小要与任务类型匹配：CPU 密集型接近核数；IO 密集型可以更大。队列无界可能积压任务，需要监控。',
              '**模型差异**：Java 平台线程通常一对一映射 OS 线程；Go goroutine 由运行时做 M:N 调度，轻量且可创建大量。Java 21 的虚拟线程也在向轻量并发靠拢，但本课不展开。',
            ],
            table: {
              headers: ['维度', 'Java 平台线程', 'Go goroutine'],
              rows: [
                ['映射', '通常 1:1 OS 线程', 'M:N 调度到少量 OS 线程'],
                ['创建成本', '较高', '很低'],
                ['数量级', '数千需谨慎', '可到数十万'],
                ['同步', '锁 / 原子类 / 并发容器', 'channel / mutex'],
              ],
            },
            note: '线程池不是越大越好；并发过高会增加上下文切换与内存压力。',
          },
        },
        {
          id: 'c12l3-s3',
          type: 'example',
          content: {
            scenarios: [
              {
                name: '场景 1：固定线程池汇总平方和',
                code: `import java.util.ArrayList;
import java.util.List;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;
import java.util.concurrent.Future;

public class PoolDemo {
    public static void main(String[] args) throws Exception {
        ExecutorService pool = Executors.newFixedThreadPool(2);
        List<Future<Integer>> futures = new ArrayList<>();
        for (int i = 1; i <= 4; i++) {
            int n = i;
            futures.add(pool.submit(() -> n * n));
        }
        int sum = 0;
        for (Future<Integer> future : futures) {
            sum += future.get();
        }
        System.out.println(sum);
        pool.shutdown();
    }
}`,
                output: '30',
                lineNotes: {
                  9: '固定两个工作线程，4 个任务会排队复用线程。',
                  12: 'lambda 捕获循环变量需要 effectively final，先复制到 n。',
                  13: 'submit 返回 Future，任务异步执行。',
                  16: '按提交顺序取结果。',
                  17: '1 + 4 + 9 + 16 = 30。',
                  20: '关闭线程池。',
                },
                takeaway: '**一般规则**：线程池复用线程并限制并发；submit Callable 后用 Future 汇总结果。',
              },
              {
                name: '场景 2：invokeAll 批量执行',
                code: `import java.util.List;
import java.util.concurrent.Callable;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;
import java.util.concurrent.Future;

public class InvokeAllDemo {
    public static void main(String[] args) throws Exception {
        ExecutorService pool = Executors.newFixedThreadPool(2);
        List<Callable<String>> tasks = List.of(() -> "a", () -> "b");
        List<Future<String>> results = pool.invokeAll(tasks);
        for (Future<String> result : results) {
            System.out.println(result.get());
        }
        pool.shutdown();
    }
}`,
                output: 'a\nb',
                lineNotes: {
                  9: '两个工作线程。',
                  10: '两个 Callable 任务。',
                  11: 'invokeAll 等待全部完成，返回顺序与任务列表一致。',
                  12: '按任务顺序读取结果。',
                  15: '关闭线程池。',
                },
                takeaway: '**一般规则**：invokeAll 适合批量提交并等待全部完成；结果 Future 与任务顺序对应。',
              },
            ],
          },
        },
        {
          id: 'c12l3-s4',
          type: 'quiz',
          content: {
            kind: 'choice',
            question: '`shutdown()` 与 `shutdownNow()` 的主要区别是？',
            options: [
              '没有区别',
              'shutdown 等待已提交任务完成；shutdownNow 尝试中断执行中的任务',
              'shutdownNow 只关闭空线程池',
              'shutdown 会立即杀死所有线程',
            ],
            answerIndex: 1,
            explanation: 'shutdown 是优雅关闭，等待已提交任务；shutdownNow 停止接收新任务并尝试中断正在执行的任务。',
          },
        },
        {
          id: 'c12l3-s5',
          type: 'coding',
          content: {
            exerciseId: 'c12l3-squares',
            task: '读入 n，用固定 2 线程的线程池提交 1..n 的平方任务，汇总输出平方和。',
            io: `输入：一个整数 n
输出：1² + 2² + ... + n²
样例：输入 4 → 输出 30
约束：使用 ExecutorService + Future，并 shutdown。`,
            skeleton: `import java.util.ArrayList;
import java.util.List;
import java.util.Scanner;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;
import java.util.concurrent.Future;

public class Main {
    public static void main(String[] args) throws Exception {
        Scanner scanner = new Scanner(System.in);
        int n = scanner.nextInt();
        ExecutorService pool = Executors.newFixedThreadPool(2);
        List<Future<Integer>> futures = new ArrayList<>();
        // 提交 1..n 的平方任务
        int sum = 0;
        // 汇总结果
        System.out.println(sum);
        pool.shutdown();
    }
}`,
            hints: [
              '概念回顾：submit Callable 返回 Future，get 取回结果。',
              '解题方向：循环 i=1..n，复制到局部变量后提交 `i*i`；再遍历 futures 求和。',
              '关键 API：`ExecutorService.submit`、`Future.get`、`shutdown`。',
            ],
            tests: [
              {
                label: '四个数',
                kind: 'normal',
                stdin: '4\n',
                expectedStdout: '30\n',
              },
              {
                label: '只有一个数',
                kind: 'edge',
                stdin: '1\n',
                expectedStdout: '1\n',
              },
              {
                label: '五个数',
                kind: 'tricky',
                stdin: '5\n',
                expectedStdout: '55\n',
              },
            ],
            answer: `import java.util.ArrayList;
import java.util.List;
import java.util.Scanner;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;
import java.util.concurrent.Future;

public class Main {
    public static void main(String[] args) throws Exception {
        Scanner scanner = new Scanner(System.in);
        int n = scanner.nextInt();
        ExecutorService pool = Executors.newFixedThreadPool(2);
        List<Future<Integer>> futures = new ArrayList<>();
        for (int i = 1; i <= n; i++) {
            int value = i;
            futures.add(pool.submit(() -> value * value));
        }
        int sum = 0;
        for (Future<Integer> future : futures) {
            sum += future.get();
        }
        System.out.println(sum);
        pool.shutdown();
    }
}`,
            answerWhy:
              '每个任务计算一个平方值，Future 按提交顺序汇总。固定两个线程意味着任务可能排队，但结果与执行顺序无关。最后 shutdown 释放线程池。',
          },
        },
        {
          id: 'c12l3-s6',
          type: 'summary',
          content: {
            points: [
              {
                kind: 'general',
                text: '**一般规则**：线程池复用线程、限制并发；固定线程池适合任务数量可控的批处理。',
              },
              {
                kind: 'general',
                text: '**一般规则**：submit 返回 Future；invokeAll 批量等待。使用完要 shutdown。',
              },
              {
                kind: 'general',
                text: '**一般规则**：池大小按任务类型与资源限制设计，队列无界会掩盖积压。',
              },
              {
                kind: 'scenario',
                text: '平方和展示任务提交与汇总；invokeAll 展示批量等待；模型表对比 Go goroutine。',
              },
            ],
          },
        },
        {
          id: 'c12l3-s7',
          type: 'pitfall',
          content: {
            items: [
              {
                wrong: '每次任务都 `new Thread`，没有线程池。',
                why: '线程创建销毁成本高，数量失控会耗尽资源。',
                right: '用合适的 ExecutorService 复用线程。',
              },
              {
                wrong: '循环里提交任务后不保存 Future，也不等待。',
                why: '主线程可能先结束，异常被忽略，结果不可用。',
                right: '保存 Future 并 get / invokeAll，最后 shutdown。',
              },
              {
                wrong: '线程池大小随意设成 1000，认为越大越快。',
                why: '上下文切换、内存与下游资源都会成为瓶颈。',
                right: '按 CPU / IO 特性与压测结果设定。',
              },
            ],
          },
        },
      ],
    },
  ],
}
