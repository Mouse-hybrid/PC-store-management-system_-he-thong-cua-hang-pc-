import { CreditCard } from "./CreditCard";
import { Handshake } from "./Handshake";
import { Headphones } from "./Headphones";
import { Medal } from "./Medal";
import { Truck } from "./Truck";
import line15 from "./line-15.svg";

const tabs = [
  { label: "MÔ TẢ SẢN PHẨM", active: true },
  { label: "THÔNG TIN CHI TIẾT", active: false },
  { label: "THÔNG SỐ KỸ THUẬT", active: false },
  { label: "ĐÁNH GIÁ KHÁC  HÀNG", active: false },
];

const policies = [
  { icon: "medal", text: "Bảo hành 7 ngày (lỗi do shop)" },
  { icon: "truck", text: "Giao acc tự động sau 1–5 phút" },
  { icon: "handshake", text: "Hoàn tiền nếu acc sai mô tả" },
  { icon: "headphones", text: "Hỗ trợ khách hàng 24/7" },
  { icon: "creditcard", text: "Thanh toán an toàn – bảo mật tuyệt đối" },
];

const renderPolicyIcon = (icon) => {
  switch (icon) {
    case "medal":
      return <Medal className="!relative !w-6 !h-6" />;
    case "truck":
      return <Truck className="!relative !w-6 !h-6" />;
    case "handshake":
      return <Handshake className="!relative !w-6 !h-6" />;
    case "headphones":
      return <Headphones className="!relative !w-6 !h-6" color="#FA8232" />;
    case "creditcard":
      return <CreditCard className="!relative !w-6 !h-6" />;
    default:
      return null;
  }
};

export const ProductSpecsSection = () => {
  return (
    <div className="flex-col items-center justify-center gap-10 pt-0 pb-10 px-0 bg-gray-00 border-t border-solid border-gray-100 w-full">
      <div className="w-full px-[300px] box-border">
        <div className="flex items-start gap-6">
          <div className="relative w-[1320px] h-14">
            <img
              className="absolute top-[55px] left-0 w-[1320px] h-px object-cover"
              alt="Line"
              src={line15}
              crossOrigin="anonymous"
            />

            {tabs.map((tab) => (
              <div
                key={tab.label}
                className={`px-5 py-[18px] rounded-sm inline-flex items-start gap-2.5 ${
                  tab.active
                    ? "bg-gray-00 shadow-[inset_0px_-3px_0px_#f98131,inset_0px_1px_0px_#e4e7e9]"
                    : "bg-gray-00"
                }`}
                style={{ marginLeft: tab.active ? 341 : undefined }}
              >
                <div
                  className={`w-fit font-label-03 font-[number:var(--label-03-font-weight)] text-[length:var(--label-03-font-size)] leading-[var(--label-03-line-height)] whitespace-nowrap relative mt-[-1.00px] ${
                    tab.active ? "text-gray-900" : "text-gray-600"
                  } tracking-[var(--label-03-letter-spacing)] [font-style:var(--label-03-font-style)]`}
                >
                  {tab.label}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="flex gap-6 mt-10 items-start">
          <div className="flex flex-col items-start gap-4 w-2/3">
            <p className="w-[616px] font-body-medium-600 text-gray-900">
              MÔ TẢ SẢN PHẨM
            </p>
            <p className="relative w-[576px] font-body-small-400 text-gray-600">
              PC Gaming RTX 4060 hiệu năng cao, phù hợp chơi các game như{" "}
              <br />
              Valorant, CS2, GTA V, PUBG ở thiết lập High – Ultra. <br />
              <br />
              Trang bị: <br />
              • CPU Intel Core i7 <br />
              • RAM 32GB <br />
              • SSD 1TB <br />
              • GPU RTX 4060 <br />
              <br />
              Máy được lắp ráp và kiểm tra kỹ trước khi giao.
            </p>
          </div>

          <div className="flex flex-col items-start gap-4 w-1/3">
            <p className="relative w-[280px] font-body-medium-600 text-gray-900">
              CHÍNH SÁCH / CAM KẾT
            </p>

            <div className="flex-col gap-3 inline-flex items-start">
              {policies.map((policy) => (
                <div
                  key={policy.icon}
                  className="inline-flex items-center justify-center gap-2 relative"
                >
                  {renderPolicyIcon(policy.icon)}
                  <p className="relative w-[248px] font-body-small-400 text-gray-900">
                    {policy.text}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

