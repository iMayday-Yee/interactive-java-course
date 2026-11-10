import type { Chapter } from '../../types/content'

export const chapter13: Chapter = {
  id: 'chapter-13',
  number: 13,
  title: 'IO 基础',
  subtitle: '字节流处理原始字节，字符流处理文本并涉及编码；新 IO 用 Path / Files 把常见文件操作变短。',
  lessons: [
    {
      id: 'c13l1',
      chapter: 13,
      title: '字节流与字符流',
      summary: '二进制数据用字节流，文本用字符流；字符流需要编码，UTF-8 是最常用的明确选择。',
      steps: [
        {
          id: 'c13l1-s1',
          type: 'goal',
          content: {
            text: '你能区分 InputStream / OutputStream 与 Reader / Writer，用 BufferedReader 逐行读取文本，并处理读取结束的 -1 / null。',
            checklist: ['知道字节流与字符流的适用场景', '知道 read() 返回 -1 表示结束', '知道 readLine() 返回 null 表示结束'],
          },
        },
        {
          id: 'c13l1-s2',
          type: 'concept',
          content: {
            title: '字节是底层，字符是文本',
            paragraphs: [
              '**字节流**：`InputStream` / `OutputStream`，以 byte 为单位，适合图片、压缩包、二进制协议。',
              '**字符流**：`Reader` / `Writer`，以 char 为单位，适合文本；需要字符编码把字节解码成字符。',
              '读取字节：`read()` 返回 0~255，结束返回 -1。读取字符行：`BufferedReader.readLine()` 返回一行文本，结束返回 null。',
              '`InputStreamReader` 是字节流到字符流的桥；创建时显式指定编码，例如 `StandardCharsets.UTF_8`，避免平台默认编码差异。',
              '文本文件优先用字符流 + BufferedReader；二进制文件绝不能用字符流，否则编码转换会破坏数据。',
              '所有流都应关闭；实现 AutoCloseable 的流用 try-with-resources，异常路径也能释放资源。',
            ],
            table: {
              headers: ['数据类型', '抽象', '常用类', '结束信号'],
              rows: [
                ['二进制', '`InputStream` / `OutputStream`', '`FileInputStream` / `ByteArrayInputStream`', '`read()` 返回 -1'],
                ['文本', '`Reader` / `Writer`', '`BufferedReader` / `InputStreamReader`', '`readLine()` 返回 null'],
                ['桥接', '字节 → 字符', '`InputStreamReader`', '指定编码'],
              ],
            },
            note: '字符数不等于字节数：UTF-8 中一个汉字通常 3 字节，但 String.length 可能按 UTF-16 码元计算。',
          },
        },
        {
          id: 'c13l1-s3',
          type: 'example',
          content: {
            scenarios: [
              {
                name: '场景 1：逐字节读取',
                code: `import java.io.ByteArrayInputStream;
import java.io.IOException;

public class ByteDemo {
    public static void main(String[] args) throws IOException {
        byte[] data = { 72, 101, 108, 108, 111 };
        try (ByteArrayInputStream input = new ByteArrayInputStream(data)) {
            int value;
            while ((value = input.read()) != -1) {
                System.out.print((char) value);
            }
        }
        System.out.println();
    }
}`,
                output: 'Hello',
                lineNotes: {
                  6: '五个字节对应 ASCII 的 H e l l o。',
                  7: 'try-with-resources 自动关闭 ByteArrayInputStream。',
                  9: 'read 返回下一个字节，结束返回 -1。',
                  10: '把字节强制转换成 char 后打印。',
                  13: '补一个换行，便于观察。',
                },
                takeaway: '**一般规则**：字节流读的是原始字节；read 返回 -1 表示流结束。',
              },
              {
                name: '场景 2：逐行读取文本',
                code: `import java.io.BufferedReader;
import java.io.IOException;
import java.io.StringReader;

public class CharDemo {
    public static void main(String[] args) throws IOException {
        try (BufferedReader reader =
                new BufferedReader(new StringReader("第一行\\n第二行"))) {
            String line;
            while ((line = reader.readLine()) != null) {
                System.out.println(line);
            }
        }
    }
}`,
                output: '第一行\n第二行',
                lineNotes: {
                  7: 'try-with-resources 声明资源，作用域结束自动关闭。',
                  8: 'StringReader 提供内存文本，BufferedReader 负责按行读取。',
                  9: '声明 line 保存每一行。',
                  10: 'readLine 返回 null 表示没有更多内容。',
                  11: '按行输出。',
                },
                takeaway: '**一般规则**：文本按行读取用 BufferedReader.readLine；null 是结束信号。',
              },
            ],
          },
        },
        {
          id: 'c13l1-s4',
          type: 'quiz',
          content: {
            kind: 'choice',
            question: '读取一个 UTF-8 文本文件并按行处理，最合适的选择是？',
            options: [
              '`FileInputStream` 逐字节读取',
              '`BufferedReader` + `InputStreamReader(UTF_8)`',
              '`ByteArrayOutputStream`',
              '`ObjectOutputStream`',
            ],
            answerIndex: 1,
            explanation: '文本需要字符流；InputStreamReader 指定 UTF-8，BufferedReader 提供按行读取。字节流会拿到原始字节，不适合直接处理文本行。',
          },
        },
        {
          id: 'c13l1-s5',
          type: 'coding',
          content: {
            exerciseId: 'c13l1-lines',
            task: '用 BufferedReader 从标准输入逐行读取，输出行数与总字符数（不含换行符）。',
            io: `输入：若干行文本，直到 EOF
输出：lines:<行数> chars:<字符数>
样例：输入 "hello" 换行 "world" → 输出 lines:2 chars:10
约束：必须使用 BufferedReader.readLine。`,
            skeleton: `import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;
import java.nio.charset.StandardCharsets;

public class Main {
    public static void main(String[] args) throws IOException {
        BufferedReader reader = new BufferedReader(
                new InputStreamReader(System.in, StandardCharsets.UTF_8));
        int lines = 0;
        int chars = 0;
        // 逐行读取并统计
        System.out.println("lines:" + lines + " chars:" + chars);
    }
}`,
            hints: [
              '概念回顾：readLine 返回 null 表示输入结束。',
              '解题方向：每读一行 lines++，chars += line.length()。',
              '关键 API：`BufferedReader.readLine`。',
            ],
            tests: [
              {
                label: '两行英文',
                kind: 'normal',
                stdin: 'hello\nworld\n',
                expectedStdout: 'lines:2 chars:10\n',
              },
              {
                label: '单行',
                kind: 'edge',
                stdin: 'a\n',
                expectedStdout: 'lines:1 chars:1\n',
              },
              {
                label: '空输入',
                kind: 'tricky',
                stdin: '',
                expectedStdout: 'lines:0 chars:0\n',
              },
            ],
            answer: `import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;
import java.nio.charset.StandardCharsets;

public class Main {
    public static void main(String[] args) throws IOException {
        BufferedReader reader = new BufferedReader(
                new InputStreamReader(System.in, StandardCharsets.UTF_8));
        int lines = 0;
        int chars = 0;
        String line;
        while ((line = reader.readLine()) != null) {
            lines++;
            chars += line.length();
        }
        System.out.println("lines:" + lines + " chars:" + chars);
    }
}`,
            answerWhy:
              'readLine 去掉行尾换行符，所以 line.length 统计的是正文字符数。循环到 null 结束，空输入自然得到 0 行 0 字符。',
          },
        },
        {
          id: 'c13l1-s6',
          type: 'summary',
          content: {
            points: [
              {
                kind: 'general',
                text: '**一般规则**：二进制用字节流，文本用字符流；文本处理要显式指定编码。',
              },
              {
                kind: 'general',
                text: '**一般规则**：字节流 read 返回 -1 结束；readLine 返回 null 结束。',
              },
              {
                kind: 'general',
                text: '**一般规则**：流必须关闭；try-with-resources 保证异常路径也释放资源。',
              },
              {
                kind: 'scenario',
                text: 'ByteArrayInputStream 展示逐字节；BufferedReader 展示逐行与 null 结束。',
              },
            ],
          },
        },
        {
          id: 'c13l1-s7',
          type: 'pitfall',
          content: {
            items: [
              {
                wrong: '用字符流读取图片或压缩包。',
                why: '编码转换会破坏二进制数据，文件无法使用。',
                right: '二进制数据用 InputStream / OutputStream。',
              },
              {
                wrong: '用 `while (reader.read() != -1)` 处理文本并期待完整字符。',
                why: 'read 返回单个字节，多字节字符会被拆开。',
                right: '文本用 Reader / BufferedReader。',
              },
              {
                wrong: '忘记关闭流，只在正常路径 close。',
                why: '异常路径会泄漏文件句柄。',
                right: 'try-with-resources。',
              },
            ],
          },
        },
      ],
    },
    {
      id: 'c13l2',
      chapter: 13,
      title: 'Files、Path 与逐行读取',
      summary: 'Path 表示路径，Files 提供读写、判断、遍历；常见操作会抛受检 IOException。',
      steps: [
        {
          id: 'c13l2-s1',
          type: 'goal',
          content: {
            text: '你能用 Path / Files 读写文本文件、判断存在、逐行遍历，并正确处理 IOException 与资源关闭。',
            checklist: ['会 Path.of 与 Files.readString', '会用 Files.lines 逐行处理', '知道 IOException 是受检异常'],
          },
        },
        {
          id: 'c13l2-s2',
          type: 'concept',
          content: {
            title: '新 IO：Path + Files',
            paragraphs: [
              '`Path.of("demo.txt")` 表示路径；相对路径相对于程序的工作目录。',
              '`Files.readString(path)` 一次性读取整个文本文件；`Files.writeString(path, content)` 写入文本。两者默认使用 UTF-8。',
              '`Files.exists` 判断存在；`Files.createDirectories` 创建多级目录；`Files.deleteIfExists` 删除文件或空目录。',
              '`Files.lines(path)` 返回按行分割的 Stream，必须关闭（用 try-with-resources）；大文件逐行处理比一次性读入更省内存。',
              '`Files.list(dir)` 列出目录项，返回 Stream，也需要关闭。',
              '这些方法大多抛受检 `IOException`，调用方必须 catch 或声明 throws。',
            ],
            table: {
              headers: ['方法', '作用', '注意'],
              rows: [
                ['`Files.readString`', '读取整个文本', '大文件可能占用大量内存'],
                ['`Files.writeString`', '写入文本', '默认覆盖，不是追加'],
                ['`Files.lines`', '按行 Stream', '必须关闭'],
                ['`Files.list`', '列目录', '必须关闭'],
                ['`Files.createDirectories`', '创建多级目录', '已存在不报错'],
              ],
            },
            note: '需要追加内容时用 `Files.writeString(path, text, StandardOpenOption.APPEND)`，默认是覆盖。',
          },
        },
        {
          id: 'c13l2-s3',
          type: 'example',
          content: {
            scenarios: [
              {
                name: '场景 1：写文件再读回',
                code: `import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;

public class FileDemo {
    public static void main(String[] args) throws IOException {
        Path file = Path.of("demo.txt");
        Files.writeString(file, "hello\\njava");
        System.out.println(Files.readString(file));
        Files.deleteIfExists(file);
    }
}`,
                output: 'hello\njava',
                lineNotes: {
                  7: '相对路径，文件会创建在程序工作目录。',
                  8: '写入文本；默认覆盖已有内容。',
                  9: '一次性读取全部文本并打印。',
                  10: '删除文件；不存在时不会报错。',
                },
                takeaway: '**一般规则**：小文本文件用 Files.readString / writeString；用完清理临时文件。',
              },
              {
                name: '场景 2：Files.lines 逐行处理',
                code: `import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.util.List;
import java.util.stream.Stream;

public class LinesDemo {
    public static void main(String[] args) throws IOException {
        Path file = Path.of("lines.txt");
        Files.write(file, List.of("a", "b"));
        try (Stream<String> lines = Files.lines(file)) {
            lines.forEach(System.out::println);
        }
        Files.deleteIfExists(file);
    }
}`,
                output: 'a\nb',
                lineNotes: {
                  9: '创建路径。',
                  10: '写入两行文本。',
                  11: 'Files.lines 返回 Stream，必须关闭。',
                  12: '逐行消费并打印。',
                  14: '删除临时文件。',
                },
                takeaway: '**一般规则**：大文件逐行处理用 Files.lines，并把它放进 try-with-resources。',
              },
            ],
          },
        },
        {
          id: 'c13l2-s4',
          type: 'quiz',
          content: {
            kind: 'choice',
            question: '关于 `Files.readString`，哪一句正确？',
            options: [
              '它不需要处理异常',
              '它是受检 IOException，必须 catch 或 throws',
              '它只能读取二进制文件',
              '它返回字节数组',
            ],
            answerIndex: 1,
            explanation: 'Files.readString 抛受检 IOException；返回 String，适合文本，不适合二进制。',
          },
        },
        {
          id: 'c13l2-s5',
          type: 'coding',
          content: {
            exerciseId: 'c13l2-roundtrip',
            task: '读入一行文本，写入一个临时文件，再读回并输出大写内容，最后删除文件。',
            io: `输入：一行文本
输出：写回后读到的内容（大写）
样例：输入 hello → 输出 HELLO
约束：使用 Files.createTempFile / writeString / readString / deleteIfExists。`,
            skeleton: `import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.util.Scanner;

public class Main {
    public static void main(String[] args) throws IOException {
        Scanner scanner = new Scanner(System.in);
        String text = scanner.nextLine();
        Path file = Files.createTempFile("java-lesson", ".txt");
        Files.writeString(file, text);
        // 读回、转大写、删除
    }
}`,
            hints: [
              '概念回顾：Files.writeString 写入，readString 读取。',
              '解题方向：读取后 `toUpperCase()` 输出，再 deleteIfExists。',
              '关键 API：`Files.readString`、`Files.deleteIfExists`。',
            ],
            tests: [
              {
                label: '小写文本',
                kind: 'normal',
                stdin: 'hello\n',
                expectedStdout: 'HELLO\n',
              },
              {
                label: '单个字符',
                kind: 'edge',
                stdin: 'z\n',
                expectedStdout: 'Z\n',
              },
              {
                label: '中文文本',
                kind: 'tricky',
                stdin: '订单\n',
                expectedStdout: '订单\n',
              },
            ],
            answer: `import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.util.Scanner;

public class Main {
    public static void main(String[] args) throws IOException {
        Scanner scanner = new Scanner(System.in);
        String text = scanner.nextLine();
        Path file = Files.createTempFile("java-lesson", ".txt");
        Files.writeString(file, text);
        System.out.println(Files.readString(file).toUpperCase());
        Files.deleteIfExists(file);
    }
}`,
            answerWhy:
              'createTempFile 生成唯一文件，避免测试之间互相覆盖；writeString / readString 完成文本往返；最后 deleteIfExists 清理。中文没有大小写变化，输出原样。',
          },
        },
        {
          id: 'c13l2-s6',
          type: 'summary',
          content: {
            points: [
              {
                kind: 'general',
                text: '**一般规则**：Path 表示路径，Files 提供文本读写、存在判断、遍历与删除。',
              },
              {
                kind: 'general',
                text: '**一般规则**：Files.lines / Files.list 返回 Stream，必须关闭；大文件优先逐行处理。',
              },
              {
                kind: 'general',
                text: '**一般规则**：这些方法抛受检 IOException；writeString 默认覆盖，不是追加。',
              },
              {
                kind: 'scenario',
                text: 'writeString / readString 展示小文件往返；Files.lines 展示逐行流。',
              },
            ],
          },
        },
        {
          id: 'c13l2-s7',
          type: 'pitfall',
          content: {
            items: [
              {
                wrong: '`Files.writeString(path, text)` 期待追加到旧内容后面。',
                why: '默认是覆盖，旧内容会丢失。',
                right: '显式传 StandardOpenOption.APPEND。',
              },
              {
                wrong: '`Files.lines(path)` 后不关闭 Stream。',
                why: '文件句柄可能泄漏，尤其在异常路径。',
                right: '用 try-with-resources 包裹 Stream。',
              },
              {
                wrong: '用 Files.readString 读取大文件。',
                why: '一次性把全部内容读进内存，可能 OOM。',
                right: '用 Files.lines 逐行处理。',
              },
            ],
          },
        },
      ],
    },
  ],
}
