import { Check } from "./Check";
import { CheckCircle } from "./CheckCircle";
import { Checks } from "./Checks";
import { Handshake } from "./Handshake";
import { MapPinLine } from "./MapPinLine";
import { MapTrifold } from "./MapTrifold";
import { Notebook } from "./Notebook";
import { Package } from "./Package";
import { Truck } from "./Truck";
import { User } from "./User";

const formatUsd = (v) => `$${Number(v).toLocaleString("en-US")}`;

const VIETNAM_TZ = "Asia/Ho_Chi_Minh";

const formatVietnamDate = (d) =>
  new Intl.DateTimeFormat("vi-VN", {
    timeZone: VIETNAM_TZ,
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  }).format(d);

const formatVietnamTime = (d) =>
  new Intl.DateTimeFormat("vi-VN", {
    timeZone: VIETNAM_TZ,
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  }).format(d);

const formatVietnamDateTime = (d) =>
  `${formatVietnamDate(d)} – ${formatVietnamTime(d)}`;

const orderSteps = [
  { label: "Đã đặt hàng", Icon: Notebook, active: true, opacity: false },
  { label: "Đang xử lý", Icon: Package, active: true, opacity: false },
  { label: "Đang giao hàng", Icon: Truck, active: false, opacity: true },
  { label: "Hoàn tất", Icon: Handshake, active: false, opacity: true },
];

const activityItemsTemplate = [
  {
    iconBg: "bg-success-50 border-success-100",
    Icon: Checks,
    iconProps: {},
    message: "Đơn hàng đã được giao thành công. Cảm ơn bạn đã mua hàng",
    offsetMinutes: 0,
  },
  {
    iconBg: "bg-secondary-50 border-secondary-100",
    Icon: User,
    iconProps: {},
    message: "Thanh toán đã được xác nhận",
    offsetMinutes: 1,
  },
  {
    iconBg: "bg-secondary-50 border-secondary-100",
    Icon: MapPinLine,
    iconProps: { color: "#2DA5F3" },
    message: "Đơn hàng đang được chuẩn b",
    offsetMinutes: 3,
  },
  {
    iconBg: "bg-secondary-50 border-secondary-100",
    Icon: MapTrifold,
    iconProps: {},
    message: "Đơn hàng đang được giao đến địa chỉ của bạn",
    offsetMinutes: 5,
  },
  {
    iconBg: "bg-success-50 border-success-100",
    Icon: CheckCircle,
    iconProps: {},
    message: "Đơn hàng đã được giao thành công. Cảm ơn bạn đã mua hàng",
    offsetMinutes: 6,
  },
];

export const OrderTrackingDetailSection = ({
  orderTotal = 0,
  orderCode = "#96459761",
  orderPlacedAt,
}) => {
  const displayOrderCode = orderCode?.startsWith("#")
    ? orderCode
    : `#${orderCode}`;
  const formattedTotal = formatUsd(orderTotal);
  const baseDate = orderPlacedAt ? new Date(orderPlacedAt) : new Date();
  const orderPlacedAtText = formatVietnamDateTime(baseDate);

  const activityItems = activityItemsTemplate.map(
    ({ offsetMinutes, ...rest }) => {
      const d = new Date(baseDate.getTime() + offsetMinutes * 60000);
      return { ...rest, time: formatVietnamDateTime(d) };
    }
  );

  return (
    <div className="inline-flex w-full max-w-[1920px] mx-auto h-[876px] relative flex-col items-start px-[300px] py-[72px] box-border">
      <div className="inline-flex flex-col items-start relative flex-[0_0_auto] bg-gray-00 rounded overflow-hidden border border-solid border-gray-100">
        <div className="inline-flex flex-col items-start gap-6 p-6 relative flex-[0_0_auto]">
          <div className="flex w-[936px] items-center justify-between p-6 relative flex-[0_0_auto] bg-warning-50 rounded border border-solid border-warning-200">
            <div className="inline-flex flex-col items-start gap-2 relative flex-[0_0_auto]">
              <div className="relative w-[399px] mt-[-1.00px] font-body-XL-400 text-gray-900 text-[20px]">
                {displayOrderCode}
              </div>

              <div className="inline-flex items-center justify-center gap-2 relative flex-[0_0_auto]">
                <div className="relative w-fit mt-[-1.00px] font-body-small-400 text-gray-700 text-[length:var(--body-small-400-font-size)] whitespace-nowrap">
                  2 Đơn hàng
                </div>

                <div className="relative w-fit mt-[-1.00px] font-body-small-400 text-gray-700 whitespace-nowrap">
                  •
                </div>

                <p className="relative w-fit mt-[-1.00px] font-body-small-400 text-gray-700 whitespace-nowrap">
                  Thời gian đặt: {orderPlacedAtText}
                </p>
              </div>
            </div>

            <div className="relative w-fit font-heading-02 text-secondary-500 text-[length:var(--heading-02-font-size)] whitespace-nowrap">
              {formattedTotal}
            </div>
          </div>

          <p className="relative w-[936px] font-body-small-400 text-gray-700 text-[length:var(--body-small-400-font-size)] tracking-[var(--body-small-400-letter-spacing)] leading-[var(--body-small-400-line-height)] [font-style:var(--body-small-400-font-style)]">
            Thời gian đặt: {orderPlacedAtText}
          </p>

          <div className="inline-flex flex-col items-center justify-center gap-6 relative flex-[0_0_auto]">
            <div className="relative w-[722px] h-6">
              <div className="absolute top-2 left-2 w-[702px] h-2 bg-primary-100 rounded-[100px]" />
              <div className="absolute top-2 left-2 w-[234px] h-2 bg-primary-500 rounded-[100px]" />
              <div className="absolute top-0 left-0 w-6 h-6 bg-primary-500 rounded-xl" />
              <div className="left-[230px] bg-primary-500 border-gray-00 absolute top-0 w-6 h-6 rounded-xl border-2 border-solid" />
              <div className="left-[464px] bg-gray-00 border-primary-500 absolute top-0 w-6 h-6 rounded-xl border-2 border-solid" />
              <div className="left-[698px] bg-gray-00 border-primary-500 absolute top-0 w-6 h-6 rounded-xl border-2 border-solid" />
              <Check className="!absolute !top-1.5 !left-1.5 !w-3 !h-3" />
            </div>

            <div className="inline-flex items-start relative flex-[0_0_auto]">
              {orderSteps.map(({ label, Icon, opacity }, index) => (
                <div
                  key={index}
                  className={`inline-flex flex-col items-center justify-center gap-3 relative flex-[0_0_auto]${opacity ? " opacity-50" : ""}`}
                >
                  <Icon className="!relative !w-8 !h-8" />
                  <div className="relative w-[234px] font-body-small-500 font-[number:var(--body-small-500-font-weight)] text-gray-900 text-[length:var(--body-small-500-font-size)] text-center tracking-[var(--body-small-500-letter-spacing)] leading-[var(--body-small-500-line-height)] [font-style:var(--body-small-500-font-style)]">
                    {label}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="flex flex-col w-[984px] items-start gap-6 p-6 relative flex-[0_0_auto] bg-gray-00 border border-solid border-gray-100">
          <div className="relative w-[936px] mt-[-1.00px] font-body-large-500 text-gray-900 text-[length:var(--body-large-500-font-size)] tracking-[var(--body-large-500-letter-spacing)] leading-[var(--body-large-500-line-height)] [font-style:var(--body-large-500-font-style)]">
            HOẠT ĐỘNG ĐƠN HÀNG
          </div>

          <div className="inline-flex flex-col items-start gap-4 relative flex-[0_0_auto]">
            {activityItems.map(
              ({ iconBg, Icon, iconProps, message, time }, index) => (
                <div
                  key={index}
                  className="inline-flex items-start gap-4 relative flex-[0_0_auto]"
                >
                  <div
                    className={`${iconBg} inline-flex items-start gap-2.5 p-3 relative flex-[0_0_auto] rounded-sm border border-solid`}
                  >
                    <Icon className="!relative !w-6 !h-6" {...iconProps} />
                  </div>

                  <div className="inline-flex flex-col items-start gap-2 relative flex-[0_0_auto]">
                    <p className="relative w-[872px] mt-[-1.00px] font-body-small-400 font-[number:var(--body-small-400-font-weight)] text-gray-900 text-[length:var(--body-small-400-font-size)] tracking-[var(--body-small-400-letter-spacing)] leading-[var(--body-small-400-line-height)] [font-style:var(--body-small-400-font-style)]">
                      {message}
                    </p>

                    <div className="relative w-[872px] font-body-small-400 font-[number:var(--body-small-400-font-weight)] text-gray-500 text-[length:var(--body-small-400-font-size)] tracking-[var(--body-small-400-letter-spacing)] leading-[var(--body-small-400-line-height)] [font-style:var(--body-small-400-font-style)]">
                      {time}
                    </div>
                  </div>
                </div>
              )
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

