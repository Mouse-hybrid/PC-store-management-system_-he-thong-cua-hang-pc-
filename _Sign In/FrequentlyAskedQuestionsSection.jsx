import { useState } from "react";
import { ArrowRight } from "./ArrowRight";
import { Minus } from "./Minus";
import { Plus } from "./Plus";

const faqData = [
  { id: 1, question: "Nếu đăng nhập không được thì làm sao?", answer: null },
  {
    id: 2,
    question: "Sau khi mua PC cần làm gì?",
    answer:
      "Sau khi nhận PC, bạn nên:\nKiểm tra sản phẩm khi nhận\nCài đặt và cập nhật driver\nLiên hệ shop nếu có lỗi",
  },
  { id: 3, question: "PC có bảo hành không?", answer: null },
  { id: 4, question: "Có đổi trả sản phẩm không?", answer: null },
  { id: 5, question: "Thanh toán bằng cách nào?", answer: null },
];

export const FrequentlyAskedQuestionsSection = () => {
  const [openId, setOpenId] = useState(2);
  const [email, setEmail] = useState("");
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");

  const handleToggle = (id) => {
    setOpenId(openId === id ? null : id);
  };

  return (
    <div className="inline-flex items-start gap-[136px] px-[300px] py-[72px] relative flex-[0_0_auto]">
      <div className="inline-flex flex-col items-start gap-10 relative flex-[0_0_auto]">
        <div className="relative w-[760px] mt-[-1.00px] font-heading-01 font-[number:var(--heading-01-font-weight)] text-gray-900 text-[length:var(--heading-01-font-size)] tracking-[var(--heading-01-letter-spacing)] leading-[var(--heading-01-line-height)] [font-style:var(--heading-01-font-style)]">
          Câu hỏi thường gặp
        </div>

        <div className="relative w-[760px] flex flex-col gap-0">
          {faqData.map((item) => {
            const isOpen = openId === item.id;
            return (
              <div key={item.id} className="mb-0">
                {isOpen && item.answer ? (
                  <div className="inline-flex flex-col items-center justify-center gap-6 pt-0 pb-6 px-0 relative w-[760px] bg-gray-00 rounded border border-solid border-gray-100 shadow-dropdown-shadow mb-0">
                    <button
                      type="button"
                      onClick={() => handleToggle(item.id)}
                      className="inline-flex items-center justify-center gap-9 px-6 py-5 relative flex-[0_0_auto] bg-primary-500 rounded-[4px_4px_0px_0px] w-full text-left cursor-pointer border-none outline-none"
                    >
                      <p className="relative w-[656px] mt-[-1.00px] font-body-large-600 font-[number:var(--body-large-600-font-weight)] text-gray-00 text-[length:var(--body-large-600-font-size)] tracking-[var(--body-large-600-letter-spacing)] leading-[var(--body-large-600-line-height)] [font-style:var(--body-large-600-font-style)]">
                        {item.question}
                      </p>
                      <Minus className="!relative !w-5 !h-5" />
                    </button>

                    <div className="inline-flex flex-col items-start gap-4 relative flex-[0_0_auto]">
                      <p className="relative w-[712px] mt-[-1.00px] font-body-small-400 font-[number:var(--body-small-400-font-weight)] text-gray-700 text-[length:var(--body-small-400-font-size)] tracking-[var(--body-small-400-letter-spacing)] leading-[var(--body-small-400-line-height)] [font-style:var(--body-small-400-font-style)]">
                        {item.answer.split("\n").map((line, i) => (
                          <span key={i}>
                            {line}
                            {i < item.answer.split("\n").length - 1 && <br />}
                          </span>
                        ))}
                      </p>
                    </div>
                  </div>
                ) : (
                  <button
                    type="button"
                    onClick={() => handleToggle(item.id)}
                    className="inline-flex items-center justify-center gap-9 px-6 py-5 w-full bg-gray-00 rounded overflow-hidden border border-solid border-gray-100 text-left cursor-pointer outline-none mb-0"
                  >
                    <p className="relative w-[656px] mt-[-1.00px] font-body-large-500 font-[number:var(--body-large-500-font-weight)] text-gray-900 text-[length:var(--body-large-500-font-size)] tracking-[var(--body-large-500-letter-spacing)] leading-[var(--body-large-500-line-height)] [font-style:var(--body-large-500-font-style)]">
                      {item.question}
                    </p>
                    <Plus className="!relative !w-5 !h-5" />
                  </button>
                )}
              </div>
            );
          })}
        </div>
      </div>

      <div className="gap-6 p-8 bg-warning-100 rounded inline-flex flex-col items-start relative flex-[0_0_auto]">
        <div className="gap-3 inline-flex flex-col items-start relative flex-[0_0_auto]">
          <p className="relative w-[360px] mt-[-1.00px] font-body-large-500 font-[number:var(--body-large-500-font-weight)] text-gray-900 text-[length:var(--body-large-500-font-size)] tracking-[var(--body-large-500-letter-spacing)] leading-[var(--body-large-500-line-height)] [font-style:var(--body-large-500-font-style)]">
            Không tìm thấy câu trả lời? Liên hệ hỗ trợ
          </p>

          <p className="relative w-[360px] font-body-small-400 font-[number:var(--body-small-400-font-weight)] text-gray-700 text-[length:var(--body-small-400-font-size)] tracking-[var(--body-small-400-letter-spacing)] leading-[var(--body-small-400-line-height)] [font-style:var(--body-small-400-font-style)]">
            Nếu bạn chưa tìm được thông tin cần thiết, hãy gửi tin nhắn cho chúng tôi.
            <br /> Đội ngũ hỗ trợ sẽ phản hồi trong thời gian sớm nhất.
          </p>
        </div>

        <div className="gap-3 inline-flex flex-col items-start relative flex-[0_0_auto]">
          <input
            className="relative w-[360px] h-11 bg-gray-00 rounded-sm border border-solid border-warning-200 font-body-small-400 font-[number:var(--body-small-400-font-weight)] text-gray-500 text-[length:var(--body-small-400-font-size)] tracking-[var(--body-small-400-letter-spacing)] leading-[var(--body-small-400-line-height)] whitespace-nowrap [font-style:var(--body-small-400-font-style)] p-0 pl-4"
            placeholder="Email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <input
            className="relative w-[360px] h-11 bg-gray-00 rounded-sm border border-solid border-warning-200 font-body-small-400 font-[number:var(--body-small-400-font-weight)] text-gray-500 text-[length:var(--body-small-400-font-size)] tracking-[var(--body-small-400-letter-spacing)] leading-[var(--body-small-400-line-height)] whitespace-nowrap [font-style:var(--body-small-400-font-style)] p-0 pl-4"
            placeholder="Tiêu đề"
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />

          <textarea
            className="relative w-[360px] h-[88px] bg-gray-00 rounded-sm border border-solid border-warning-200 font-body-small-400 font-[number:var(--body-small-400-font-weight)] text-gray-500 text-[length:var(--body-small-400-font-size)] tracking-[var(--body-small-400-letter-spacing)] leading-[var(--body-small-400-line-height)] [font-style:var(--body-small-400-font-style)] pt-3 pl-4 resize-none"
            placeholder="Nội dung (không bắt buộc)"
            value={content}
            onChange={(e) => setContent(e.target.value)}
          />
        </div>

        <button
          type="button"
          className="px-6 py-0 h-11 flex-[0_0_auto] bg-primary-500 inline-flex items-center justify-center gap-2 relative rounded-sm cursor-pointer border-none outline-none"
        >
          <div className="font-heading-07 font-[number:var(--heading-07-font-weight)] text-gray-00 tracking-[var(--heading-07-letter-spacing)] leading-[var(--heading-07-line-height)] relative w-fit mt-[-1.00px] text-[length:var(--heading-07-font-size)] whitespace-nowrap [font-style:var(--heading-07-font-style)]">
            GỬI YÊU CẦU
          </div>
          <ArrowRight className="!relative !w-5 !h-5" />
        </button>
      </div>
    </div>
  );
};

