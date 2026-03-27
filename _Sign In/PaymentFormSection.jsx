import { useMemo, useState } from "react";
import { ArrowRight } from "./ArrowRight";
import { CreditCard } from "./CreditCard";
import productPh from "./shop-product-placeholder.svg";

const paymentMethodLabels = {
  paypal: "Paypal",
  momo: "MoMo",
  card: "Thẻ ngân hàng",
};

const PayPalIcon = (props) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 64 64"
    fill="currentColor"
    {...props}
  >
    <path d="M28 10c-3 0-5 2-6 5L13 53c-1 3 1 6 4 6h14c3 0 6-2 7-5l6-23h6c10 0 17-6 17-16C77 11 68 10 57 10H28z" />
  </svg>
);

const MoMoIcon = (props) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 64 64"
    fill="none"
    stroke="currentColor"
    strokeWidth="4"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <path d="M16 42V22h12c7 0 10 3 10 10v10" />
    <path d="M38 42V22h10c6 0 10 4 10 10v10" />
    <path d="M12 22h4" />
  </svg>
);

export const PaymentFormSection = ({
  cartCount = 0,
  onGoPaymentSuccess,
  onGoMoMo,
  checkoutSummary,
}) => {
  const [selectedPayment, setSelectedPayment] = useState("card");
  const [formData, setFormData] = useState({
    lastName: "",
    firstName: "",
    email: "",
    phone: "",
    cardHolder: "",
    cardNumber: "",
    expiry: "",
    cvv: "",
    note: "",
  });

  const orderItems = useMemo(() => {
    const preset = [80, 250, 360, 1500];
    const safeCount = Math.max(1, Math.min(cartCount, 4));
    return Array.from({ length: safeCount }, (_, idx) => ({
      id: idx + 1,
      name: "Name xxx",
      qty: 1,
      price: preset[idx % preset.length],
      image: productPh,
    }));
  }, [cartCount]);

  const defaultSubtotalNumber = orderItems.reduce(
    (sum, it) => sum + it.price * it.qty,
    0
  );
  // Checkout summary phải khớp với số tiền ở Shopping Cart (tạm tính/tổng thanh toán)
  const subtotalNumber =
    checkoutSummary?.totalValue ??
    checkoutSummary?.subtotalValue ??
    defaultSubtotalNumber;
  const formatUsd = (v) => `$${Number(v).toLocaleString("en-US")}`;

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <div className="gap-6 px-[300px] py-[72px] inline-flex items-start relative flex-[0_0_auto] w-full box-border">
      <div className="inline-flex flex-col items-start gap-10 relative flex-1">
        <div className="inline-flex gap-6 flex-[0_0_auto] flex-col items-start relative w-full">
          <div className="relative w-full font-body-large-500 text-gray-900">
            Thông tin thanh toán
          </div>
          <div className="inline-flex flex-col items-start gap-4 relative flex-[0_0_auto] w-full">
            <div className="inline-flex items-start gap-4 relative flex-[0_0_auto] w-full">
              <input name="lastName" value={formData.lastName} onChange={handleInputChange} placeholder="Họ" className="w-1/2 h-11 px-4 rounded-sm border border-solid border-gray-100" />
              <input name="firstName" value={formData.firstName} onChange={handleInputChange} placeholder="Tên" className="w-1/2 h-11 px-4 rounded-sm border border-solid border-gray-100" />
            </div>
            <div className="inline-flex items-start gap-4 relative flex-[0_0_auto] w-full">
              <input name="email" value={formData.email} onChange={handleInputChange} placeholder="Email nhận thông tin" className="w-1/2 h-11 px-4 rounded-sm border border-solid border-gray-100" />
              <input name="phone" value={formData.phone} onChange={handleInputChange} placeholder="Số điện thoại" className="w-1/2 h-11 px-4 rounded-sm border border-solid border-gray-100" />
            </div>
          </div>
        </div>

        <div className="inline-flex flex-col items-start justify-center gap-5 p-6 bg-gray-00 rounded border border-solid border-gray-100 relative flex-[0_0_auto] w-full">
          <div className="relative w-full font-body-large-500 text-gray-900">Phương thức thanh toán</div>

          <div className="inline-flex items-start gap-[3px] p-6 relative flex-[0_0_auto] bg-gray-00 border border-solid border-gray-100 w-full">
            {[
              {
                id: "paypal",
                label: paymentMethodLabels.paypal,
                icon: <PayPalIcon className="!relative !w-8 !h-8 text-[#003087]" />,
              },
              {
                id: "momo",
                label: paymentMethodLabels.momo,
                icon: <MoMoIcon className="!relative !w-8 !h-8 text-[#E20074]" />,
              },
              {
                id: "card",
                label: paymentMethodLabels.card,
                icon: <CreditCard className="!relative !w-8 !h-8 text-primary-500" />,
              },
            ].map((method, index, arr) => (
              <div key={method.id} className="inline-flex flex-1 items-start">
                <button
                  type="button"
                  onClick={() => setSelectedPayment(method.id)}
                  className="items-center justify-center gap-4 inline-flex flex-col relative flex-[0_0_auto] bg-transparent border-none cursor-pointer p-0 w-full"
                  aria-label={`Chọn ${method.label}`}
                >
                  <div className="items-center justify-center gap-2 inline-flex flex-col relative flex-[0_0_auto]">
                    {method.icon}
                    <div className="relative w-40 font-body-small-500 text-gray-900 text-[length:var(--body-small-500-font-size)] text-center tracking-[var(--body-small-500-letter-spacing)] leading-[var(--body-small-500-line-height)] whitespace-nowrap [font-style:var(--body-small-500-font-style)]">
                      {method.label}
                    </div>
                  </div>

                  {selectedPayment === method.id ? (
                    <div className="relative w-5 h-5 bg-primary-500 rounded-[100px]">
                      <div className="absolute top-1.5 left-1.5 w-2 h-2 bg-gray-00 rounded" />
                    </div>
                  ) : (
                    <div className="relative w-5 h-5 bg-gray-00 rounded-[100px] border border-solid border-gray-200" />
                  )}
                </button>

                {index < arr.length - 1 && (
                  <div className="w-px h-24 bg-gray-200" aria-hidden="true" />
                )}
              </div>
            ))}
          </div>

          <input name="cardHolder" value={formData.cardHolder} onChange={handleInputChange} placeholder="Tên chủ thẻ" className="w-full h-11 px-4 rounded-sm border border-solid border-gray-100" />
          <input name="cardNumber" value={formData.cardNumber} onChange={handleInputChange} placeholder="Số thẻ" className="w-full h-11 px-4 rounded-sm border border-solid border-gray-100" />
          <div className="inline-flex gap-4 w-full">
            <input name="expiry" value={formData.expiry} onChange={handleInputChange} placeholder="DD/YY" className="w-1/2 h-11 px-4 rounded-sm border border-solid border-gray-100" />
            <input name="cvv" value={formData.cvv} onChange={handleInputChange} placeholder="Mã bảo mật" className="w-1/2 h-11 px-4 rounded-sm border border-solid border-gray-100" />
          </div>
        </div>

        <div className="inline-flex flex-col items-start gap-4 w-full">
          <div className="font-body-large-500 text-gray-900">Thông tin bổ sung</div>
          <textarea
            name="note"
            value={formData.note}
            onChange={handleInputChange}
            placeholder="Ghi chú đơn hàng (Không bắt buộc)"
            className="w-full h-[124px] p-4 rounded-sm border border-solid border-gray-100 resize-none"
          />
        </div>
      </div>

      <div className="w-[420px] bg-gray-00 rounded border border-solid border-gray-100 p-6 shrink-0">
        <div className="font-body-large-500 text-gray-900 mb-4">Tóm tắt đơn hàng</div>
        <div className="flex flex-col gap-3 mt-4">
          <div className="flex justify-between">
            <span className="text-gray-600">Tạm tính</span>
            <span>{formatUsd(subtotalNumber)}</span>
          </div>
          <div className="flex justify-between"><span className="text-gray-600">Phí vận chuyển</span><span>Free</span></div>
          <div className="flex justify-between"><span className="text-gray-600">Giảm giá</span><span>$0</span></div>
          <div className="flex justify-between pt-3 border-t border-solid border-gray-100">
            <span className="font-body-medium-400 text-gray-900">Tổng thanh toán</span>
            <span className="font-body-medium-600 text-gray-900">{formatUsd(subtotalNumber)}</span>
          </div>
        </div>
        <button
          type="button"
          className="w-full mt-6 py-3 bg-primary-500 text-gray-00 rounded-sm inline-flex items-center justify-center gap-2"
          onClick={() => {
            if (selectedPayment === "momo") {
              onGoMoMo?.();
              return;
            }
            onGoPaymentSuccess?.();
          }}
        >
          XÁC NHẬN THANH TOÁN
          <ArrowRight className="!w-5 !h-5" color="white" />
        </button>
      </div>
    </div>
  );
};

