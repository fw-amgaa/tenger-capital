import { MacbookScroll } from "@/components/ui/macbook-scroll";

export function MacbookScrollSection() {
  return (
    <div className="w-full overflow-hidden bg-[#1a1a1a]">
      <MacbookScroll
        title={
          <span>
            Our services. <br /> What Tenger Capital will offer:
          </span>
        }
        src={`/about-us/dashboard.png`}
        showGradient={false}
      />
    </div>
  );
}
