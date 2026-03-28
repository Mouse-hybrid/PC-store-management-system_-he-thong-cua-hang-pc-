import { useEffect, useMemo, useState } from "react";

import icon2 from "./icon-2.svg";
import icon from "./icon.svg";
import image from "./image.svg";
import { formatVND } from "@/utils/formatCurrency";

const ORDER_INFO = {
  orderDescription: "Thanh toán hóa đơn dịch vụ MoMo",
  expiryTime: 14 * 60 + 59,
};

const STEPS = [
  { icon: icon2, label: "Mở App", iconClass: "w-5 h-5" },
  { icon: icon2, label: "Quét Mã", iconClass: "w-5 h-[18px]" },
  { icon: icon2, label: "Xác nhận", iconClass: "w-5 h-5" },
];

const SUPPORT_CONTACTS = [
  { icon: icon2, iconClass: "w-[13.5px] h-[13.5px]", value: "0937418564" },
  { icon: icon2, iconClass: "w-[15px] h-3", value: "support@storypc.com" },
];

const formatTime = (seconds) => {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
};

const formatCheckoutAmount = (value) => formatVND(value || 0);

export const PaymentQRCodeSection = ({
  onGoPaymentSuccess,
  amount = 0,
  orderCode = "MOMO123456789",
}) => {
  const [timeLeft, setTimeLeft] = useState(ORDER_INFO.expiryTime);
  const [qrSrc, setQrSrc] = useState(null);

  const qrCandidates = useMemo(
    () => [
      "/QR-container.svg",
      "/QR%20Container.svg",
      "/QR Container.svg",
      // Tên bạn copy từ Downloads vào public/
      "/9b85b6d03a60b43eed71%201.svg",
      "/9b85b6d03a60b43eed71 1.svg",
    ],
    []
  );

  useEffect(() => {
    if (timeLeft <= 0) return;
    const timer = setInterval(() => {
      setTimeLeft((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, [timeLeft]);

  // Load QR từ thư mục `public/` để Vite có thể serve file tĩnh.
  useEffect(() => {
    let cancelled = false;

    const tryLoad = async () => {
      for (const url of qrCandidates) {
        const ok = await new Promise((resolve) => {
          const img = new Image();
          img.onload = () => resolve(true);
          img.onerror = () => resolve(false);
          img.src = url;
        });

        if (ok && !cancelled) {
          setQrSrc(url);
          return;
        }
      }

      if (!cancelled) setQrSrc(null);
    };

    tryLoad();

    return () => {
      cancelled = true;
    };
  }, [qrCandidates]);

  return (
    <div className="w-full max-w-[1320px] mx-auto bg-[#fff8f8] overflow-hidden rounded-xl">
      {/* Top bar */}
      <div className="w-full bg-white shadow-[0px_20px_40px_#a500640f]">
        <div className="flex w-full h-20 items-center justify-start gap-6 px-8">
          <div className="font-black text-[#a50064] text-2xl tracking-[-1.20px] leading-8">
            MoMo
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="w-full px-8 py-12">
        <div className="grid grid-cols-12 h-fit gap-8">
          {/* Left panel */}
          <div className="relative row-[1_/_2] col-[1_/_9] w-full h-fit flex flex-col items-start bg-white rounded-xl overflow-hidden shadow-[0px_20px_40px_#a500640f]">
            <div className="flex items-center justify-between px-8 py-4 relative self-stretch w-full bg-[#ffe8ee]">
              <div className="inline-flex items-center gap-2 relative flex-[0_0_auto]">
                <div className="inline-flex flex-col items-start relative flex-[0_0_auto]">
                  <img
                    className="relative w-5 h-5"
                    alt="Icon"
                    src={icon}
                    crossOrigin="anonymous"
                  />
                </div>

                <div className="items-center gap-[5.68e-14px] inline-flex relative flex-[0_0_auto]">
                  <p className="relative flex items-center w-[195.14px] h-6 font-medium text-[#7b0049] text-base tracking-[0] leading-6 whitespace-nowrap">
                    Đơn hàng sẽ hết hạn sau
                  </p>

                  <div className="relative flex items-center w-[51.48px] h-7 mt-[-1.00px] font-bold text-[#7b0049] text-lg tracking-[0] leading-7 whitespace-nowrap">
                    {formatTime(timeLeft)}
                  </div>
                </div>
              </div>

              <div className="inline-flex items-center gap-2 relative flex-[0_0_auto]">
                <div className="inline-flex flex-col items-start relative flex-[0_0_auto]">
                  <img
                    className="relative w-[9.33px] h-[12.25px]"
                    alt="Icon"
                    src={image}
                    crossOrigin="anonymous"
                  />
                </div>

                <div className="inline-flex flex-col items-start relative flex-[0_0_auto]">
                  <div className="relative flex items-center w-[132.7px] h-5 mt-[-1.00px] font-normal text-[#574149] text-sm tracking-[0] leading-5 whitespace-nowrap">
                    Thanh toán an toàn
                  </div>
                </div>
              </div>
            </div>

            <div className="relative self-stretch w-full h-[732px]">
              <div className="inline-flex flex-col items-start pt-0 pb-2 px-0 absolute top-12 left-[241px]">
                <div className="inline-flex flex-col items-center relative flex-[0_0_auto]">
                  <p className="relative flex items-center justify-center w-[318.17px] h-8 mt-[-1.00px] font-bold text-[#25181d] text-2xl text-center tracking-[0] leading-8 whitespace-nowrap">
                    Quét mã QR để thanh toán
                  </p>
                </div>
              </div>

              <div className="max-w-md pt-0 pb-10 px-0 top-[88px] left-44 inline-flex flex-col items-start absolute">
                <div className="inline-flex flex-col max-w-md items-center px-[18.31px] py-0 relative flex-[0_0_auto]">
                  <p className="relative w-[411.38px] h-12 mt-[-1.00px] font-normal text-[#574149] text-base text-center tracking-[0] leading-6">
                    Sử dụng App MoMo hoặc ứng dụng camera hỗ trợ QR
                    <br />
                    code để quét mã
                  </p>
                </div>
              </div>

              {/* Step indicators */}
              <div className="pt-10 pb-0 px-0 top-[472px] left-[227px] inline-flex flex-col items-start absolute">
                <div className="inline-flex flex-col items-center relative flex-[0_0_auto]">
                  <div className="inline-flex items-center gap-6 relative flex-[0_0_auto]">
                    {STEPS.map((step, index) => (
                      <div
                        key={step.label}
                        className="inline-flex items-center gap-6 relative flex-[0_0_auto]"
                      >
                        <div className="inline-flex flex-col items-center gap-1 relative flex-[0_0_auto]">
                          <div className="w-12 h-12 bg-[#ffe8ee] flex items-center justify-center relative rounded-full">
                            <div className="inline-flex flex-col items-center relative flex-[0_0_auto]">
                              <img
                                className={`relative ${step.iconClass}`}
                                alt="Icon"
                                src={step.icon}
                                crossOrigin="anonymous"
                              />
                            </div>
                          </div>

                          <div className="relative flex items-center justify-center h-4 font-medium text-[#574149] text-xs text-center tracking-[0] leading-4 whitespace-nowrap">
                            {step.label}
                          </div>
                        </div>

                        {index < STEPS.length - 1 && (
                          <div className="relative w-12 h-px bg-[#debec8]" />
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* QR */}
              {qrSrc ? (
                <img
                  className="absolute top-[136px] left-[calc(50.00%_-_188px)] w-[376px] h-[376px]"
                  alt="Qr container"
                  src={qrSrc}
                  crossOrigin="anonymous"
                />
              ) : null}

              {/* Confirm */}
              <div className="inline-flex flex-col items-start pt-12 pb-0 px-0 absolute top-[580px] left-60">
                <button
                  type="button"
                  onClick={onGoPaymentSuccess}
                  className="all-[unset] box-border inline-flex flex-col items-center justify-center px-10 py-4 relative flex-[0_0_auto] rounded-full bg-[linear-gradient(90deg,rgba(123,0,73,1)_0%,rgba(165,0,100,1)_100%)] cursor-pointer"
                >
                  <div className="absolute w-full h-full top-0 left-0 bg-[#ffffff01] rounded-full shadow-[0px_4px_6px_-4px_#0000001a,0px_10px_15px_-3px_#0000001a]" />

                  <div className="relative flex items-center justify-center w-[239.63px] h-6 mt-[-1.00px] font-bold text-white text-base text-center tracking-[0] leading-6 whitespace-nowrap">
                    ĐÃ THANH TOÁN
                  </div>
                </button>
              </div>
            </div>
          </div>

          {/* Right panel */}
          <div className="relative row-[1_/_2] col-[9_/_13] w-full h-fit flex flex-col items-start gap-6">
            <div className="flex flex-col items-start relative self-stretch w-full flex-[0_0_auto] bg-white rounded-xl overflow-hidden shadow-[0px_20px_40px_#a500640f]">
              <div className="flex flex-col items-start p-6 relative self-stretch w-full flex-[0_0_auto] border-b border-[#ffe8ee]">
                <div className="relative flex items-center self-stretch mt-[-1.00px] font-bold text-[#25181d] text-lg tracking-[0] leading-7">
                  Thông tin đơn hàng
                </div>
              </div>

              <div className="flex flex-col items-start gap-6 p-6 relative self-stretch w-full flex-[0_0_auto]">
                <div className="grid grid-cols-1 grid-rows-[44px_44px] h-fit gap-4">
                  <div className="relative row-[1_/_2] col-[1_/_2] w-full h-fit flex flex-col items-start gap-1">
                    <div className="flex flex-col items-start relative self-stretch w-full">
                      <div className="relative flex items-center self-stretch mt-[-1.00px] font-semibold text-[#574149] text-xs tracking-[0.60px] leading-4">
                        MÃ ĐƠN HÀNG
                      </div>
                    </div>
                    <div className="flex flex-col items-start relative self-stretch w-full">
                      <div className="relative flex items-center self-stretch mt-[-1.00px] font-medium text-[#25181d] text-base tracking-[0] leading-6">
                        {orderCode}
                      </div>
                    </div>
                  </div>

                  <div className="relative row-[2_/_3] col-[1_/_2] w-full h-fit flex flex-col items-start gap-1">
                    <div className="flex flex-col items-start relative self-stretch w-full">
                      <div className="relative flex items-center self-stretch mt-[-1.00px] font-semibold text-[#574149] text-xs tracking-[0.60px] leading-4">
                        THÔNG TIN ĐƠN HÀNG
                      </div>
                    </div>
                    <div className="flex flex-col items-start relative self-stretch w-full">
                      <p className="relative flex items-center self-stretch mt-[-1.00px] font-medium text-[#25181d] text-base tracking-[0] leading-6">
                        {ORDER_INFO.orderDescription}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col items-start pt-6 pb-0 px-0 relative self-stretch w-full border-t border-[#fae2e9]">
                  <div className="flex items-end justify-between py-0 relative self-stretch w-full">
                    <div className="inline-flex flex-col items-start relative flex-[0_0_auto]">
                      <div className="relative flex items-center w-[61.63px] h-5 mt-[-1.00px] font-normal text-[#574149] text-sm tracking-[0.70px] leading-5 whitespace-nowrap">
                        SỐ TIỀN
                      </div>
                    </div>
                    <div className="inline-flex flex-col items-start relative flex-[0_0_auto]">
                      <div className="relative flex items-center w-[169.39px] h-9 mt-[-1.00px] font-black text-[#7b0049] text-3xl tracking-[-1.50px] leading-9 whitespace-nowrap">
                        {formatCheckoutAmount(amount)}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex flex-col items-start gap-4 p-6 relative self-stretch w-full bg-[#fff0f3] rounded-xl">
              <div className="flex items-center gap-3 relative self-stretch w-full">
                <div className="w-10 h-10 bg-white shadow-[0px_1px_2px_#0000000d] flex items-center justify-center relative rounded-full">
                  <div className="inline-flex flex-col items-start relative flex-[0_0_auto]">
                    <img
                      className="relative w-5 h-[18px]"
                      alt="Icon"
                      src={icon2}
                      crossOrigin="anonymous"
                    />
                  </div>
                </div>

                <div className="inline-flex flex-col items-start relative flex-[0_0_auto]">
                  <div className="flex flex-col items-start relative self-stretch w-full">
                    <div className="relative flex items-center w-[129.23px] h-5 mt-[-1.00px] font-bold text-[#25181d] text-sm tracking-[0] leading-5 whitespace-nowrap">
                      Hỗ trợ khách hàng
                    </div>
                  </div>
                  <div className="flex flex-col items-start relative self-stretch w-full">
                    <p className="relative flex items-center w-[175.45px] h-4 mt-[-1.00px] font-normal text-[#574149] text-xs tracking-[0] leading-4 whitespace-nowrap">
                      24/7 luôn sẵn sàng hỗ trợ bạn
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex flex-col items-start gap-3 relative self-stretch w-full">
                {SUPPORT_CONTACTS.map((contact) => (
                  <div
                    key={contact.value}
                    className="flex items-center gap-2 relative self-stretch w-full"
                  >
                    <div className="inline-flex flex-col items-start relative flex-[0_0_auto]">
                      <img
                        className={`relative ${contact.iconClass}`}
                        alt="Icon"
                        src={contact.icon}
                        crossOrigin="anonymous"
                      />
                    </div>
                    <div className="relative flex items-center w-fit mt-[-1.00px] font-medium text-[#7b0049] text-sm tracking-[0] leading-5 whitespace-nowrap">
                      {contact.value}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom footer */}
      <footer className="w-full bg-[#fff8f8] border-t border-zinc-100">
        <div className="flex items-center justify-center px-8 py-12 w-full">
          <div className="font-bold text-zinc-400 text-lg leading-7">MoMo</div>
        </div>
      </footer>
    </div>
  );
};

