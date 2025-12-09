import Image from "next/image";
import Link from "next/link";
import GradientBorderButton from "../gradient-border-button";
import { cn } from "@/lib/utils";

const Footer = () => {
  return (
    <footer className="p-4">
      <div className="relative flex flex-col gap-4 lg:gap-8 lg:pt-[3rem]">
        <div
          className={cn(
            "relative grid h-full gap-[5rem] rounded-[2rem] grid-cols-1 grid-rows-[1fr] lg:grid-cols-3 px-[2rem] pt-[2.5rem] pb-[4rem] lg:p-[3rem] lg:pb-[5rem] lg:gap-0 bg-white",
            // "md:min-h-[40rem] lg:min-h-[50rem]"
            "md:min-h-[20rem] lg:min-h-[30rem]"
          )}
        >
          <div className="flex h-full flex-col justify-between max-md:items-center">
            <Link
              className="type-btn text-black flex items-center gap-[1rem] opacity-[.5] transition-opacity duration-300 hover:opacity-100 text-sm"
              href="#"
            >
              Back to top
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="10"
                height="8"
                fill="none"
              >
                <path
                  fill="currentColor"
                  d="M5 3.006.833 7.173l.584.583L5 4.173l3.583 3.583.584-.583zm-5-2.5h10v.833H0z"
                ></path>
              </svg>
            </Link>

            <Image
              src={"/logo/logo_main_black.png"}
              alt="logo"
              width={128}
              height={50}
            />
          </div>

          <div className="flex h-full flex-col justify-between items-center">
            <div className="flex flex-col gap-[4rem] lg:flex-row lg:gap-[30%]">
              <div className="text-black type-xs flex flex-col gap-2 text-center lg:text-left">
                <h4 className="text-sm opacity-[.4]">Tenger Capital</h4>
                <ul className="flex flex-col text-sm">
                  <li>
                    <Link
                      className="relative w-fit inline-block pb-[.1rem] after:absolute after:bottom-0 after:left-0 after:h-px after:w-0 after:bg-black after:transition-all after:duration-300 hover:after:w-full"
                      target="_self"
                      href="/"
                    >
                      Home
                    </Link>
                  </li>
                  <li>
                    <Link
                      className="relative w-fit pt-[.2rem] lg:pt-[.35rem] inline-block pb-[.1rem] after:absolute after:bottom-0 after:left-0 after:h-px after:w-0 after:bg-black after:transition-all after:duration-300 hover:after:w-full"
                      target="_self"
                      href="/about"
                    >
                      About
                    </Link>
                  </li>
                  <li>
                    <Link
                      className="relative w-fit pt-[.2rem] lg:pt-[.35rem] inline-block pb-[.1rem] after:absolute after:bottom-0 after:left-0 after:h-px after:w-0 after:bg-black after:transition-all after:duration-300 hover:after:w-full"
                      target="_self"
                      href="/offerings"
                    >
                      What We Offer
                    </Link>
                  </li>
                  {/* <li>
                    <Link
                      className="relative w-fit pt-[.2rem] lg:pt-[.35rem] inline-block pb-[.1rem] after:absolute after:bottom-0 after:left-0 after:h-px after:w-0 after:bg-black after:transition-all after:duration-300 hover:after:w-full"
                      target="_self"
                      href="/TG-testimonials"
                    >
                      Client Testimonials
                    </Link>
                  </li>
                  <li>
                    <Link
                      className="relative w-fit pt-[.2rem] lg:pt-[.35rem] inline-block pb-[.1rem] after:absolute after:bottom-0 after:left-0 after:h-px after:w-0 after:bg-black after:transition-all after:duration-300 hover:after:w-full"
                      target="_self"
                      href="/careers"
                    >
                      Careers
                    </Link>
                  </li>
                  <li>
                    <Link
                      className="relative w-fit pt-[.2rem] lg:pt-[.35rem] inline-block pb-[.1rem] after:absolute after:bottom-0 after:left-0 after:h-px after:w-0 after:bg-black after:transition-all after:duration-300 hover:after:w-full"
                      target="_self"
                      href="/blog"
                    >
                      Blog
                    </Link>
                  </li>
                  <li>
                    <Link
                      className="relative w-fit pt-[.2rem] lg:pt-[.35rem] inline-block pb-[.1rem] after:absolute after:bottom-0 after:left-0 after:h-px after:w-0 after:bg-black after:transition-all after:duration-300 hover:after:w-full"
                      target="_blank"
                      rel="noopener noreferrer"
                      href="https://Linkpp.TG.com/historical-performance"
                    >
                      Historical Performance
                    </Link>
                  </li>
                  <li>
                    <Link
                      className="relative w-fit pt-[.2rem] lg:pt-[.35rem] inline-block pb-[.1rem] after:absolute after:bottom-0 after:left-0 after:h-px after:w-0 after:bg-black after:transition-all after:duration-300 hover:after:w-full"
                      target="_self"
                      href="/legal"
                    >
                      Legal
                    </Link>
                  </li>
                  <li>
                    <Link
                      className="relative w-fit pt-[.2rem] lg:pt-[.35rem] inline-block pb-[.1rem] after:absolute after:bottom-0 after:left-0 after:h-px after:w-0 after:bg-black after:transition-all after:duration-300 hover:after:w-full"
                      target="_self"
                      href="/privacy-policy"
                    >
                      Privacy
                    </Link>
                  </li>
                  <li>
                    <Link
                      className="relative w-fit pt-[.2rem] lg:pt-[.35rem] inline-block pb-[.1rem] after:absolute after:bottom-0 after:left-0 after:h-px after:w-0 after:bg-black after:transition-all after:duration-300 hover:after:w-full"
                      target="_self"
                      href="/terms"
                    >
                      Terms
                    </Link>
                  </li>
                  <li>
                    <Link
                      className="relative w-fit pt-[.2rem] lg:pt-[.35rem] inline-block pb-[.1rem] after:absolute after:bottom-0 after:left-0 after:h-px after:w-0 after:bg-black after:transition-all after:duration-300 hover:after:w-full"
                      target="_blank"
                      rel="noopener noreferrer"
                      href="https://help.TG.com/"
                    >
                      Help
                    </Link>
                  </li> */}
                </ul>
              </div>
              {/* <div className="text-black type-xs flex flex-col gap-2 text-center lg:text-left">
                <h4 className="text-sm opacity-[.4]">Strategies</h4>
                <ul className="flex flex-col text-sm">
                  <li>
                    <Link
                      className="relative w-fit inline-block pb-[.1rem] after:absolute after:bottom-0 after:left-0 after:h-px after:w-0 after:bg-black after:transition-all after:duration-300 hover:after:w-full"
                      target="_self"
                      href="/smart-treasury"
                    >
                      Smart Treasury
                    </Link>
                  </li>
                  <li>
                    <Link
                      className="relative w-fit pt-[.2rem] lg:pt-[.35rem] inline-block pb-[.1rem] after:absolute after:bottom-0 after:left-0 after:h-px after:w-0 after:bg-black after:transition-all after:duration-300 hover:after:w-full"
                      target="_self"
                      href="/flagship"
                    >
                      Flagship
                    </Link>
                  </li>
                  <li>
                    <Link
                      className="relative w-fit pt-[.2rem] lg:pt-[.35rem] inline-block pb-[.1rem] after:absolute after:bottom-0 after:left-0 after:h-px after:w-0 after:bg-black after:transition-all after:duration-300 hover:after:w-full"
                      target="_self"
                      href="/opportunities"
                    >
                      Opportunities
                    </Link>
                  </li>
                  <li>
                    <Link
                      className="relative w-fit pt-[.2rem] lg:pt-[.35rem] inline-block pb-[.1rem] after:absolute after:bottom-0 after:left-0 after:h-px after:w-0 after:bg-black after:transition-all after:duration-300 hover:after:w-full"
                      target="_self"
                      href="/offshore"
                    >
                      Offshore
                    </Link>
                  </li>
                  <li>
                    <Link
                      className="relative w-fit pt-[.2rem] lg:pt-[.35rem] inline-block pb-[.1rem] after:absolute after:bottom-0 after:left-0 after:h-px after:w-0 after:bg-black after:transition-all after:duration-300 hover:after:w-full"
                      target="_self"
                      href="/Linkutomatedstocks"
                    >
                      Automated Stocks
                    </Link>
                  </li>
                  <li>
                    <Link
                      className="relative w-fit pt-[.2rem] lg:pt-[.35rem] inline-block pb-[.1rem] after:absolute after:bottom-0 after:left-0 after:h-px after:w-0 after:bg-black after:transition-all after:duration-300 hover:after:w-full"
                      target="_self"
                      href="automatedbonds"
                    >
                      Automated Bonds
                    </Link>
                  </li>
                  <li>
                    <Link
                      className="relative w-fit pt-[.2rem] lg:pt-[.35rem] inline-block pb-[.1rem] after:absolute after:bottom-0 after:left-0 after:h-px after:w-0 after:bg-black after:transition-all after:duration-300 hover:after:w-full"
                      target="_self"
                      href="TGcrypto"
                    >
                      Crypto
                    </Link>
                  </li>
                  <li>
                    <Link
                      className="relative w-fit pt-[.2rem] lg:pt-[.35rem] inline-block pb-[.1rem] after:absolute after:bottom-0 after:left-0 after:h-px after:w-0 after:bg-black after:transition-all after:duration-300 hover:after:w-full"
                      target="_self"
                      href="/Linkrkventurefund"
                    >
                      ARK Venture{" "}
                    </Link>
                  </li>
                  <li>
                    <Link
                      className="relative w-fit pt-[.2rem] lg:pt-[.35rem] inline-block pb-[.1rem] after:absolute after:bottom-0 after:left-0 after:h-px after:w-0 after:bg-black after:transition-all after:duration-300 hover:after:w-full"
                      target="_self"
                      href="/carlyleprivatecredit"
                    >
                      Carlyle Tactical Private Credit
                    </Link>
                  </li>
                </ul>
              </div> */}
            </div>
            <p className="text-black text-xs max-lg:hidden tracking-wide">
              © 2025 Tenger Capital Capital Management LLC. All Rights Reserved
            </p>
          </div>
          <div className="flex flex-col items-end justify-between max-lg:w-full lg:h-full">
            <GradientBorderButton mode="light" borderAnimation={false}>
              OPEN AN ACCOUNT
            </GradientBorderButton>
            <div className="text-black flex flex-col items-center justify-center gap-[3rem] max-lg:w-full">
              {/* <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 88 26"
                className="text-black block w-[10.5rem] lg:hidden"
              >
                <path
                  fill="currentColor"
                  d="M14.395 12.882h.001c-2.535.666-2.477-.854-4.07-.576 1.28.117 1.207.964 2.556 1.134-1.172.473-2.257-1.505-3.74-.585-1.025.636-1.822.047-1.822.047.473.841 1.244.656 1.245.656 0 0-1.038.424-.12 1.99.484.826.046.973-.435.865 0 0 .584.406.925.195.731-.45-.337-1.842-.337-1.842 1.27.743.815 2.05.455 2.181 1.085-.225.735-1.387.505-1.888-.198-.431-.171-1.182.712-1.548-.956-.085-1.342 1-1.342 1-.103-.486.043-.851.111-.972.194-.349.625-.5 1.002-.502.61-.003 1.36.762 2.025.866.453.072 1.39.123 2.33-1.021z"
                ></path>
                <path
                  fill="currentColor"
                  d="M12.944 23.803c.963 0 1.907-.126 2.82-.375.285-.078.469-.164.387-.45a39 39 0 0 1-.425-1.626c-.134-.755-.272-1.107-.792-1.458a5 5 0 0 1-.488-.38c-.14-.12-.396-.36-.39-.484 0-.038.034-.056.068-.06.138-.021.45.169.54.21 1.053.48 2.205.698 3.357.709.377.003.76.047.997-.309a.93.93 0 0 0 .035-.927c-.064-.314.027-.45.244-.644.142-.126.265-.276.177-.48a.26.26 0 0 0-.201-.163c-.113-.018-.669.052-.828.05-.064 0-.171-.005-.198-.077-.024-.062.019-.145.058-.191.04-.05.1-.085.165-.078.039.005.073.024.11.035.164.053.39-.081.54-.135.214-.077.373-.129.6-.216.059-.023.109-.105.12-.167.015-.082-.017-.279-.02-.366-.01-.299-.031-.32-.316-.251-.076.019-.183.04-.255-.006-.09-.059-.112-.207-.06-.296.053-.09.178-.106.274-.1.216.016.217.067.432.09.271.027.536-.02.716-.233.168-.198.028-.412-.014-.642-.27-1.443-.539-2.236-.574-3.352-.008-.275-.04-.55-.068-.824-.05-.49-.096-.858-.29-1.133 0 0-1.22-.188-2.343.676-.54.416-.96.966-1.35 1.519-.411.583-.567 1.068-.612 1.786-.04.628-.146 1.254-.47 1.803-.362.613-1.04.824-1.733.86-.191.01-.93-.055-.678-.48.077-.128.2-.337.174-.495-.018-.107-.103-.184-.17-.262-.145-.17-.435-.573-.663-.277-.132.171-.2.676-.517.586-.108-.03-.155-.136-.19-.233a1.8 1.8 0 0 1-.09-.464 4 4 0 0 1-.01-.462c0-.057-.017-.12-.082-.131-.099-.017-.138.09-.168.162-.144.35-.17.761-.032 1.118.074.192.191.365.336.51.051.05.123.095.145.168.039.13-.056.188-.173.172-.15-.02-.265-.153-.36-.259a1.46 1.46 0 0 1-.313-.597 1.6 1.6 0 0 1-.05-.511c.02-.308.082-.574.102-.75.005-.039-.033-.044-.067-.026-.306.17-.392.587-.388.91.004.392.14.773.333 1.11.154.268.372.658.722.67.198.007.352-.099.485-.235.034-.035.097-.097.146-.058.036.029.046.095.047.138.005.186-.135.34-.232.484a3 3 0 0 0-.399.839.2.2 0 0 1-.367.043 5 5 0 0 1-.346-.79c-.022-.061-.215-.685-.264-.66-.032.015-.03.084-.035.114a.8.8 0 0 1-.064.199c-.058.131-.142.25-.233.36-.171.205-.38.385-.523.613a2 2 0 0 0-.248.694c-.05.253-.076.51-.13.762-.178.815-.513 2.022-.827 2.794-.205.503-.348.56.095.768.169.078.463.24.635.313 1.325.563 2.733.848 4.185.848m3.91-11.84c.483-.29 1.028-.316 1.573-.369.258-.025.528-.053.788.002.19.041.39.16.444.36.05.183-.036.366-.132.517-.08.124-.17.24-.247.365a1.5 1.5 0 0 0-.168.413c-.068.267-.046.624-.288.812-.062.048-.151.074-.17-.029-.022-.127-.024-.258-.059-.382-.067-.25-.288-.747-1.273-.722-.096.002-.156-.081-.132-.173.03-.116.186-.179.289-.21.181-.056.372-.068.56-.09.29-.035.582-.059.869-.12.111-.024.394-.109.253-.26-.123-.132-.994-.121-1.284-.08-.54.076-.685.11-.962.289-.118.077-.27-.002-.26-.119.01-.108.134-.165.2-.204m-3.718 7.44a792 792 0 0 0 1.314 3.638c.028.077.05.227-.066.265-.084.027-.23.053-.374-.324a26 26 0 0 1-.947-3.021c-.15-.583-.137-.738-.019-.727.043.004.084.144.092.168M6.53 12.572c-.72-1.027-1.57-3.502 0-5.958-1.643 1.08-2.732 5.112 0 5.958M18.96 6.492c-.208.505-.768 1.024-1.706 1.51 1.084.271 1.892-.522 1.892-.522-.114.52-.803.866-1.85.972-1.597.161-2.166 1.662-2.166 1.662 1.899-2.141 4.551-1.02 4.551-1.02.03-.094-.1-1.8-.72-2.603z"
                ></path>
                <path
                  fill="currentColor"
                  d="M15.019 10.711c.453-.422 1.1-.882 1.782-.925-.178.117-.917.37-1.826 1.48-1.176 1.435-3.267.797-3.267.797.192.176.905.885 2.3.624 1.825-.34 2.036-3.157 4.978-3.502-2.77-.55-3.87 1.369-3.968 1.526M14.67 13.138a.22.22 0 0 0-.057.125c-.026.23-.11.92-.214 1.321-.11.413-.313.8-.574 1.124a1.6 1.6 0 0 0 .743-.549c.205-.26.364-.584.422-.921.05-.295.166-1.37.134-1.666 0 0-.27.369-.454.566M14.241 14.147c.054-.272.094-.514.089-.793-.198.246-.454.409-.552.475a.1.1 0 0 0-.041.076c-.043 1.463-.653 1.93-.653 1.93a.64.64 0 0 0 .289-.108c.507-.35.74-.936.868-1.58M13.312 14.96a2.9 2.9 0 0 0 .184-1.013 6 6 0 0 1-.33.127.09.09 0 0 0-.061.091c.01.243-.014.679-.063.878a2.4 2.4 0 0 1-.098.315q-.031.08-.07.154c-.024.047-.122.194-.139.244.055-.02.212-.193.244-.232a2 2 0 0 0 .333-.564M18.318 5.643c.363-.682.417-.77.642-1.51a.077.077 0 0 0-.055-.094h-.002a.08.08 0 0 0-.093.053c-.169.564-.193.655-.536 1.35a.8.8 0 0 1 .044.201M18.52 5.786c.03.005.053.013.08.023.408-.445.561-.713.87-1.23a.077.077 0 0 0-.03-.105h-.002a.08.08 0 0 0-.103.027c-.322.534-.486.814-.91 1.275.031.001.066.004.095.01M17.568 5.715l-.01.063a.52.52 0 0 1 .21.32.9.9 0 0 1 .27-.222c.016-.009.037-.017.053-.026q.003-.005.003-.013.007-.037.009-.078c.004-.13-.009-.249-.102-.343-.004-.005.206-.507.297-1.012.007-.041-.024-.077-.066-.086h-.001a.08.08 0 0 0-.088.065c-.097.466-.288.924-.308.976-.18.038-.23.195-.267.356M17.445 5.964c-.024-.019-.055-.028-.083-.038-.008-.003-.022-.005-.026-.006h-.005c-.222-.002-.307.16-.385.343q-.01.025-.017.05a.5.5 0 0 1 .163.2c.023.052.03.11.036.166.114-.097.243-.156.386-.204l.012-.033c.01-.034.018-.061.024-.1a.6.6 0 0 0 .01-.127c-.006-.101-.033-.185-.115-.25M18.027 6.72a.27.27 0 0 0-.146-.077.6.6 0 0 0-.212.009 1 1 0 0 0-.088.022q-.036.01-.069.023a.65.65 0 0 0-.285.19c-.022.026-.03.052-.04.082a1 1 0 0 1 .098.012c.173.048.292.122.37.283q.019-.004.037-.01c.214-.068.398-.171.392-.415l-.002-.01a.24.24 0 0 0-.055-.11M16.218 6.756l-.012.023c.076.065.13.13.164.225a.6.6 0 0 1 .021.204c.13-.103.272-.16.432-.202l.012-.023c.012-.027.02-.042.032-.074a.6.6 0 0 0 .03-.115c.017-.127-.006-.232-.113-.312-.017-.013-.043-.023-.06-.03-.015-.006-.037-.01-.045-.012l-.004-.001c-.231-.01-.348.135-.457.317M16.795 7.23a.63.63 0 0 0-.3.178c-.023.026-.031.052-.044.082l.09.015c.187.053.308.139.382.317q.034-.004.068-.01c.2-.046.384-.114.46-.315.013-.032.006-.062.006-.094l-.003-.014a.23.23 0 0 0-.055-.113.3.3 0 0 0-.167-.085h-.002a1 1 0 0 0-.135-.01 1 1 0 0 0-.12.012l-.016.002-.043.007q-.06.011-.12.029h-.001M15.443 7.19c-.022.033-.037.066-.054.1a.5.5 0 0 1 .111.198.6.6 0 0 1 0 .264l.019.008c.146-.155.328-.214.534-.255l.02-.033.026-.046c.017-.036.032-.064.045-.106a.5.5 0 0 0 .025-.14c0-.05-.01-.106-.035-.15a.3.3 0 0 0-.1-.099q-.015-.009-.037-.018l-.064-.02c-.01-.003-.002 0-.002 0-.235-.025-.366.12-.488.298zM16.146 7.704q-.074.008-.146.026a.63.63 0 0 0-.305.154.3.3 0 0 0-.061.11l-.002.008c.188.065.313.16.375.351.061 0 .119.002.18-.007.218-.033.423-.094.516-.307.013-.03.008-.06.01-.09l-.002-.017a.23.23 0 0 0-.048-.117.33.33 0 0 0-.2-.107.9.9 0 0 0-.232-.012l-.055.005zM14.65 8.2a.1.1 0 0 0 .02.008c.004 0 .007-.01.01-.013a.83.83 0 0 1 .487-.22q.013-.017.024-.035V7.94c.02-.035.04-.066.056-.105a.5.5 0 0 0 .04-.122c.016-.1.007-.184-.057-.267a.3.3 0 0 0-.096-.071c-.023-.008-.045-.022-.07-.024-.212-.017-.356.108-.459.284-.116.2-.158.412.044.564zM18.77 6.055c.008-.004.021-.014 0 0"
                ></path>
                <path
                  fill="currentColor"
                  d="m18.655 5.945-.109.071a.2.2 0 0 0-.065-.025.3.3 0 0 0-.065-.005.5.5 0 0 0-.213.044l-.067.031-.018.01a1 1 0 0 0-.107.073.4.4 0 0 0-.103.138.25.25 0 0 0-.018.115c0 .01-.001.024.006.03.006.006.023.004.034.006.127.03.224.084.303.188.046-.01.088-.017.132-.037.192-.085.34-.204.302-.427q-.001-.016-.013-.025l.102-.067.015-.01h-.002l.123-.081c.238-.158.429-.354.78-.589.034-.023.05-.075.027-.11-.025-.037-.08-.04-.115-.017-.355.233-.549.435-.789.593l-.14.093M14.892 4.92c-.087.34-.132.734-.217 1.075-.09.36-.429.956-.925 1.465 0 0 1.25-.447 1.515-.938.179-.356.177-.657.278-1.037.284-1.063.959-1.208 1.16-1.238-.324-.107-.668-.214-1.002-.139-.398.09-.71.428-.809.812"
                ></path>
                <path
                  fill="currentColor"
                  d="M13.715 4.704c-.191.39-.168.82-.205 1.241-.037.423-.23.84-.44 1.203a5.5 5.5 0 0 1-.419.615c-.13.167-.299.307-.448.458q-.076.074-.14.154s.19-.075.243-.099q.15-.064.293-.142c.693-.374 1.232-.997 1.553-1.692.161-.349.228-.682.273-1.058.034-.285.095-.582.25-.835.16-.262.445-.478.74-.587-.781-.165-1.408.146-1.7.742M6.363 11.096c.85-1.307-.318-3.566 2.222-6.09-1.575.816-3.255 3.491-2.222 6.09"
                ></path>
                <path
                  fill="currentColor"
                  d="M12.222 6.181a3.6 3.6 0 0 1-.42 1.299 6 6 0 0 1-.419.677c-.13.184-.299.338-.448.505q-.074.08-.14.169c.016-.007.19-.083.242-.108q.15-.072.292-.157c.692-.412 1.23-1.097 1.55-1.862.162-.385.229-.752.274-1.165.034-.313.095-.64.25-.918.185-.335.495-.604.843-.764 0 0-1.227-.026-1.725.982-.202.411-.25.882-.298 1.331z"
                ></path>
                <path
                  fill="currentColor"
                  d="M11.046 5.349c-.154.312-.27.65-.356.986-.089.344-.137.698-.262 1.032a6 6 0 0 1-.88 1.579A3.05 3.05 0 0 0 11.4 7.402c.136-.27.25-.571.33-.905.263-1.101.126-1.985 1.28-2.536 0 0-.105-.001-.16.004-.885.08-1.447.661-1.803 1.384"
                ></path>
                <path
                  fill="currentColor"
                  d="M9.688 5.531c-.426.605-.682 1.309-.805 2.036-.102.597-.122 1.036-.353 1.604 0 0 1.019-.667 1.47-1.869.282-.75.403-1.992.974-2.58.236-.244.526-.484.83-.634 0 0-.077.01-.153.026-.821.171-1.473.72-1.963 1.417"
                ></path>
                <path
                  fill="currentColor"
                  d="M7.63 7.091c-.331.852-.527 2.613-.527 2.613s.042-.058.7-.646c.446-.4.562-1.047.662-1.61.118-.662.275-1.287.689-1.83.393-.515.88-1.008 1.45-1.325 0 0-.993.194-1.924 1.088-.499.48-.806 1.08-1.05 1.71M15.703 6.649a1.04 1.04 0 0 0 .438-.635c.091-.392.271-.922.93-1.122-.62.535-.45.842-.81 1.407 1.257-.88 1.493-1.488 1.5-1.489-.184-.296-.662-.41-.983-.336-1.121.26-.7 1.76-1.401 2.378 0 0 .208-.125.326-.203M14.905 10.214c-.226.274-1.103.887-1.919 1 0 0 .45.154.88.035 0 0-.471.495-2.117.416 1.352.661 3.181-.26 3.156-1.451M6.407 11.612c.01.056.063.094.12.083l.391-.072c.15.346.336.627.645.862.323.245.762.33 1.164.251-.12-.409-.394-.777-.751-.965a1.7 1.7 0 0 0-.741-.201c.13.183.414.52.852.707a.091.091 0 0 1-.07.167 2 2 0 0 1-.44-.257 2.2 2.2 0 0 1-.426-.424 2 2 0 0 1-.13-.188q-.021-.03-.033-.063c-.009-.027-.002-.052.004-.079q.024-.09.053-.18a5 5 0 0 1 .222-.567q.052-.108.112-.212.06-.105.13-.202a1.7 1.7 0 0 1 .195-.225.09.09 0 0 1 .128.004.09.09 0 0 1-.004.129c-.309.293-.512.824-.606 1.117.25-.145.464-.326.648-.582.258-.358.343-.845.254-1.287-.437.136-.828.442-1.024.838-.189.383-.229.744-.2 1.15-.1.02-.3.06-.41.08a.1.1 0 0 0-.082.116zM8.91 10.992c-.014.016-.022.035-.012.055.012.027.052.034.079.034.1-.001.2-.025.295-.058.024-.008.279-.108.28-.106.152.317.34.574.648.784.323.22.757.29 1.152.208a1.5 1.5 0 0 0-.758-.88 1.8 1.8 0 0 0-.672-.17c.113.153.339.393.73.56a.091.091 0 0 1-.07.167 2.2 2.2 0 0 1-.425-.24 1.9 1.9 0 0 1-.372-.365 1 1 0 0 1-.064-.094c-.02-.032-.042-.063-.055-.097-.03-.077-.018-.175-.01-.255q.014-.135.05-.266c.06-.226.174-.434.313-.621a.09.09 0 0 1 .127-.019c.04.03.048.088.018.128a1.6 1.6 0 0 0-.329.792 1.6 1.6 0 0 0 .406-.436 1.3 1.3 0 0 0 .133-1.016c-.334.127-.623.385-.756.702-.129.31-.141.596-.096.913q-.144.055-.289.105a1 1 0 0 0-.29.143.2.2 0 0 0-.034.031"
                ></path>
                <path
                  fill="currentColor"
                  d="M7.51 11.32c-.021.015-.041.034-.044.055-.006.05.078.057.111.061.127.017.249-.028.37-.056q.155-.034.31-.07l.026-.006c.139.306.311.554.6.76.298.211.703.283 1.075.214v-.002a1.42 1.42 0 0 0-.693-.835 1.8 1.8 0 0 0-.583-.162c.108.152.336.406.744.58a.091.091 0 0 1-.071.167 2 2 0 0 1-.357-.193 2 2 0 0 1-.43-.402 1 1 0 0 1-.097-.143c-.034-.058-.067-.127-.055-.196l.01-.07a3.4 3.4 0 0 1 .144-.567 2 2 0 0 1 .213-.43c.028-.04.081-.055.123-.03a.09.09 0 0 1 .028.13c-.177.251-.27.614-.312.83h.002c.171-.116.323-.257.457-.444.23-.32.306-.755.227-1.15l-.001-.002c-.39.122-.74.396-.915.75-.165.334-.203.65-.18 1.002q-.153.037-.306.07c-.079.018-.161.029-.238.056a.6.6 0 0 0-.117.057c-.01.007-.026.015-.04.026M11.542 10.032h-.001l-.008.006a.06.06 0 0 0 .046.103.7.7 0 0 0 .25-.061c.171-.076.261-.114.31-.133.227.254.474.442.818.557.367.122.8.07 1.152-.116a1.48 1.48 0 0 0-.96-.631v-.001a1.8 1.8 0 0 0-.602.006q.045.046.118.098.276.198.635.215a.091.091 0 0 1-.004.182h-.004a1.4 1.4 0 0 1-.49-.111 1.3 1.3 0 0 1-.318-.196.8.8 0 0 1-.17-.177c-.028-.045-.032-.11-.037-.162a1.201 1.201 0 0 1 .199-.758.09.09 0 1 1 .15.1c-.152.23-.177.452-.172.59q.138-.119.252-.287c.178-.268.226-.623.149-.944a1.24 1.24 0 0 0-.722.636 1.53 1.53 0 0 0-.114.825l-.27.12a.7.7 0 0 0-.208.139"
                ></path>
                <path
                  fill="currentColor"
                  d="m10.21 10.513-.02.02a.059.059 0 0 0 .037.1l.017.002a.44.44 0 0 0 .189-.03s.193-.065.39-.141c.184.29.397.518.72.69.344.185.784.206 1.168.082a1.5 1.5 0 0 0-.85-.794 1.8 1.8 0 0 0-.658-.095c.113.12.344.315.719.414a.09.09 0 0 1-.046.176 1.7 1.7 0 0 1-.513-.224 1.6 1.6 0 0 1-.223-.175c-.062-.058-.145-.13-.175-.21a.4.4 0 0 1-.026-.128 1.4 1.4 0 0 1 .12-.638 1.5 1.5 0 0 1 .176-.298.09.09 0 0 1 .127-.017.09.09 0 0 1 .017.127c-.219.292-.259.58-.26.749.135-.107.251-.233.352-.394.182-.29.224-.671.133-1.01-.332.126-.62.382-.752.698-.12.29-.138.559-.104.852l-.386.144a.4.4 0 0 0-.153.1M12.908 9.375l-.015.016c-.035.037-.005.098.045.093a.8.8 0 0 0 .282-.09l.212-.116c.227.186.463.316.772.373.338.062.71-.036.997-.241a1.33 1.33 0 0 0-.924-.437 1.6 1.6 0 0 0-.508.073c.08.057.303.183.744.203a.09.09 0 0 1 .086.095.09.09 0 0 1-.09.087h-.005a2 2 0 0 1-.444-.063 1.1 1.1 0 0 1-.405-.178c-.111-.086-.102-.235-.088-.36.024-.212.07-.448.18-.632a.09.09 0 0 1 .124-.032.09.09 0 0 1 .031.125c-.096.162-.128.408-.138.582q.124-.123.22-.288c.155-.267.18-.612.087-.916a1.19 1.19 0 0 0-.655.651 1.46 1.46 0 0 0-.066.769l-.25.138a.8.8 0 0 0-.192.149"
                ></path>
                <path
                  fill="currentColor"
                  d="m14.122 8.682-.004.006c-.03.053.011.119.072.116.091-.005.268-.14.347-.18q.117-.055.24-.094v.007c.024.154.118.237.267.274a.7.7 0 0 0 .252.016c.213-.02.415-.083.494-.293.01-.023.007-.053.007-.072a.1.1 0 0 0-.005-.039c-.035-.125-.117-.18-.234-.218l-.06-.015a1.266 1.266 0 0 0-.22-.014l-.028.001a1 1 0 0 0-.136.018.7.7 0 0 0-.17.06 1 1 0 0 1-.063.03l-.294.104a2.2 2.2 0 0 0-.39.207.3.3 0 0 0-.076.086"
                ></path>
                <path
                  fill="currentColor"
                  d="M12.944 1.179a11.65 11.65 0 0 1 6.58 2.018A11.88 11.88 0 0 1 23.787 8.4 11.8 11.8 0 0 1 24.713 13a11.8 11.8 0 0 1-2.01 6.61 11.9 11.9 0 0 1-3.18 3.193 11.65 11.65 0 0 1-6.58 2.018 11.65 11.65 0 0 1-6.579-2.018A11.87 11.87 0 0 1 2.1 17.601a11.8 11.8 0 0 1-.925-4.6 11.8 11.8 0 0 1 3.447-8.36 11.747 11.747 0 0 1 3.741-2.534 11.65 11.65 0 0 1 4.581-.928m0-.679C6.071.5.5 6.096.5 13s5.571 12.5 12.444 12.5S25.388 19.904 25.388 13 19.817.5 12.944.5"
                ></path>
                <path
                  fill="currentColor"
                  d="M8.632 17.799c-.543-.113-3.082.079-2.914-2.947.193 1.475 1.017 2.409 2.826 2.17 0 0-2.388-.833-2.215-3.906 0 0-.284-.078-.502-.263-.429.627-.792 2.492-.582 3.267-.052-.06-.774-1.356.21-3.548a3.5 3.5 0 0 1-.41-.413s-1.035 1.43-.7 3.266c.177 1.48 1.995 3.35 4.287 2.374"
                ></path>
                <path
                  fill="currentColor"
                  d="M6.783 12.65c-.306 1.493.288 2.861 1.415 3.538-.851-1.517-.417-2.37-.417-2.37-.716-.153-.998-1.169-.998-1.169"
                ></path>
                <g fill="currentColor">
                  <path d="M39.275 19.618v-.404c-.208-.018-.414-.026-.617-.056-.338-.049-.65-.161-.864-.448-.18-.242-.236-.527-.254-.82-.008-.136-.01-10.09-.01-10.09.56 0 1.106-.023 1.649.008.303.018.61.098.9.199.691.241 1.165.734 1.491 1.385.24.48.389.99.509 1.51q.016.07.034.139h.403c-.21-1.41-.627-4.234-.627-4.234H30.92l-.627 4.234h.403q.018-.068.034-.139c.12-.52.268-1.03.508-1.51.326-.651.8-1.144 1.492-1.385.29-.101.596-.181.9-.199.542-.03 1.088-.008 1.648-.008 0 0-.002 9.954-.01 10.09-.018.293-.073.578-.253.82-.215.287-.526.4-.864.448-.203.03-.41.038-.617.056v.404zM43.116 19.615v-.401c.208-.018.411-.028.61-.054.652-.085.998-.418 1.095-1.067a4.4 4.4 0 0 0 .044-.667V9.21q0-.377-.025-.755c-.042-.664-.35-1.03-1-1.171-.183-.04-.373-.04-.56-.059l-.16-.013v-.404h5.754v.404l-.16.013c-.187.018-.377.02-.561.059-.65.142-.958.507-1 1.17q-.024.379-.024.756-.003 4.108 0 8.217c0 .222.01.447.043.667.098.65.444.982 1.095 1.067.2.026.402.036.61.054v.4zM58.457 19.618v-.404c-.208-.018-.414-.026-.617-.056-.338-.049-.65-.161-.864-.448-.18-.242-.235-.527-.253-.82-.008-.136-.01-10.09-.01-10.09.56 0 1.106-.023 1.648.008.304.018.61.098.9.199.692.241 1.166.734 1.492 1.385.24.48.388.99.508 1.51q.016.07.034.139h.403c-.21-1.41-.627-4.234-.627-4.234H50.103l-.626 4.234h.402q.02-.068.034-.139c.12-.52.268-1.03.509-1.51.326-.651.8-1.144 1.492-1.385.289-.101.596-.181.9-.199.542-.03 1.087-.008 1.647-.008 0 0-.001 9.954-.01 10.09-.017.293-.072.578-.253.82-.214.287-.526.4-.863.448-.203.03-.41.038-.617.056v.404zM82.963 6.807v.4c.213.019.421.023.624.056.599.096.982.37 1.075 1.016q.05.346.05.695c.005 1.499.003 6.482.003 6.482l-.001-.002s-4.537-5.718-6.755-8.53a.27.27 0 0 0-.24-.118H73.43v.426h.219c2.156 0 2.261 1.09 2.261 1.519-.003 3.064.01 9.022-.022 9.192-.046.235-.094.481-.201.69-.182.354-.535.471-.903.528a4 4 0 0 1-.267.03c-.666-.057-1.237-.305-1.69-.817-.323-.364-.547-.787-.739-1.227-1.51-3.474-2.98-6.865-4.483-10.342l-3.318.001v.403h.328c.92 0 1.688.858 1.338 1.692-1.082 2.569-2.037 4.868-3.121 7.436-.245.579-.495 1.157-.799 1.705a2.14 2.14 0 0 1-1.651 1.126c-.147.02-.294.03-.448.044v.404h4.812v-.41c-.076-.004-.144-.002-.21-.012-.205-.033-.413-.05-.61-.11a.896.896 0 0 1-.623-.89c.005-.158.013-.326.065-.473.183-.515.386-1.023.59-1.53.012-.032.082-.057.126-.057 1.638-.003 3.275 0 4.911-.005.096 0 .133.04.168.12.143.343.299.683.435 1.029a3.6 3.6 0 0 1 .178.591 1.09 1.09 0 0 1-.875 1.294c-.16.026-.324.036-.49.054v.402h6.426v-.001h3.86v-.426c-.127 0-.248.013-.367-.003a4 4 0 0 1-.594-.116c-.341-.104-.595-.328-.674-.68a4.3 4.3 0 0 1-.106-.918c-.008-2.685.005-8.203.005-8.203l8.272 10.41c.152.19.302.199.524.135 0 0 0-11.122.008-11.282.016-.3.075-.589.262-.833.212-.28.522-.39.854-.439.204-.03.41-.037.618-.055v-.402zm-18.571 8.357 2.146-5.102c.726 1.706 1.443 3.396 2.17 5.102z"></path>
                </g>
              </svg> */}
              <div className="flex gap-[1.5rem] lg:ml-auto">
                <Link
                  target="_blank"
                  aria-label="Social link for x"
                  className="flex-center"
                  href="https://x.com/TGvest"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="13"
                    height="11"
                    fill="none"
                  >
                    <path
                      fill="currentColor"
                      d="M9.514.001h1.852L7.32 4.64l4.762 6.311H8.353L5.43 7.123l-3.34 3.827H.238l4.329-4.962L0 .002h3.823L6.46 3.5zM8.862 9.84h1.027L3.262 1.055H2.16z"
                    ></path>
                  </svg>
                </Link>
                <Link
                  target="_blank"
                  aria-label="Social link for linkedin"
                  className="flex-center"
                  href="https://www.linkedin.com/company/TG-invest"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="13"
                    height="11"
                    fill="none"
                  >
                    <path
                      fill="currentColor"
                      d="M3.05 1.219a1.216 1.216 0 1 1-2.434-.002 1.216 1.216 0 0 1 2.433.002m.036 2.116H.653v7.615h2.433zm3.844 0H4.509v7.615h2.396V6.954c0-2.226 2.901-2.433 2.901 0v3.996h2.403V6.127c0-3.753-4.294-3.613-5.304-1.77z"
                    ></path>
                  </svg>
                </Link>
                <Link
                  target="_blank"
                  aria-label="Social link for youtube"
                  className="flex-center"
                  href="https://www.youtube.com/TGvest"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="17"
                    height="11"
                    fill="none"
                  >
                    <path
                      fill="currentColor"
                      d="m7 7.822 4.058-2.346L7 3.13zm9.04-6.124c.102.368.172.86.219 1.486.055.626.078 1.166.078 1.635l.047.657c0 1.712-.125 2.971-.344 3.777-.196.704-.65 1.157-1.353 1.353-.368.101-1.04.172-2.072.219a52 52 0 0 1-2.808.078l-1.243.047c-3.277 0-5.318-.125-6.124-.344-.704-.196-1.157-.65-1.353-1.353-.101-.368-.172-.86-.219-1.486A19 19 0 0 1 .79 6.133l-.047-.657c0-1.713.125-2.972.344-3.778C1.283.995 1.737.541 2.44.346 2.808.244 3.48.174 4.513.126A52 52 0 0 1 7.32.049L8.564.001c3.276 0 5.317.126 6.123.345.704.195 1.157.649 1.353 1.352"
                    ></path>
                  </svg>
                </Link>
                <Link
                  target="_blank"
                  aria-label="Social link for instagram"
                  className="flex-center"
                  href="https://www.instagram.com/TGvest"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="13"
                    height="13"
                    fill="none"
                  >
                    <path
                      fill="currentColor"
                      d="M4.422.436h5.074A3.506 3.506 0 0 1 13 3.939v5.074a3.503 3.503 0 0 1-3.504 3.503H4.422A3.506 3.506 0 0 1 .92 9.013V3.939A3.503 3.503 0 0 1 4.422.436m-.12 1.208a2.175 2.175 0 0 0-2.175 2.174v5.316c0 1.202.973 2.174 2.175 2.174h5.315a2.175 2.175 0 0 0 2.174-2.174V3.818a2.173 2.173 0 0 0-2.174-2.174zm5.828.906a.755.755 0 1 1 0 1.51.755.755 0 0 1 0-1.51m-3.17.906a3.02 3.02 0 1 1 0 6.04 3.02 3.02 0 0 1 0-6.04m0 1.208a1.812 1.812 0 1 0 0 3.624 1.812 1.812 0 0 0 0-3.624"
                    ></path>
                  </svg>
                </Link>
              </div>
              <p className="text-black text-[0.9rem] font-[400] text-balance max-lg:text-center max-lg:opacity-50 lg:hidden">
                © 2025 TG Global Capital Management USA LLC. All Rights Reserved
              </p>
            </div>
          </div>
        </div>

        <div className="bg-[#191919] leading-[1.4] text-xs rounded-[2rem] p-8 opacity-[0.8] text-[#f8f8f8CC)] [&amp;_p:not(:last-child)]:mb-[1em]">
          <p className="mb-2 font-bold text-base mt-4">1. General Provisions</p>

          <p className="mb-2">
            <strong>1.1. Introduction and Acceptance</strong>
          </p>
          <p className="mb-2">
            These Terms and Conditions (the &quot;Agreement&quot;) govern the
            provision of services by <strong>Tenger Capital LLC</strong>{" "}
            (registration number [Insert Registration Number]), a financial
            institution licensed and regulated by the Financial Regulatory
            Commission (FRC) of Mongolia, with its registered office in
            Ulaanbaatar, Mongolia (hereinafter referred to as &quot;Tenger
            Capital,&quot; the &quot;Company,&quot; &quot;we,&quot;
            &quot;us,&quot; or &quot;our&quot;).
          </p>
          <p className="mb-2">
            By opening an account, engaging in any transaction, or using any
            service provided by Tenger Capital, the client (the
            &quot;Client&quot; or &quot;you&quot;) acknowledges and agrees to be
            bound by this Agreement.
          </p>

          <p className="mb-2">
            <strong>1.2. Regulatory Framework</strong>
          </p>
          <p className="mb-2">
            Tenger Capital is authorized to operate in Mongolia and is primarily
            governed by, but not limited to, the following Mongolian legislation
            &quot;Applicable Laws&quot;): The Law on the Securities
            Market,&nbsp;The Law on Non-Bank Financial Activities (as applicable
            to specific licensed activities),&nbsp;The Law on Combating Money
            Laundering and Terrorist Financing,&nbsp;The Civil Code of
            Mongolia,&nbsp;and The Law on the Legal Status of the Financial
            Regulatory Commission (FRC).
          </p>
          <p className="mb-2">
            In the event of any conflict between this Agreement and the
            Applicable Laws, the{" "}
            <strong>Applicable Laws of Mongolia shall prevail</strong>.
          </p>

          <p className="mb-2">
            <strong>1.3. Services Provided</strong>
          </p>
          <p className="mb-2">
            Tenger Capital provides services including, but not limited
            to:&nbsp;<strong>Brokerage Services:</strong> Execution of buy and
            sell orders for securities on regulated markets.&nbsp;
            <strong>Underwriting Services:</strong> Facilitation of issuance and
            distribution of securities (IPO, SEO, etc.).&nbsp;
            <strong>
              Wealth Management & Investment Advisory Services:
            </strong>{" "}
            Portfolio management, financial planning, and investment
            recommendations.
          </p>

          <hr className="border-gray-700 my-4" />

          <p className="mb-2 font-bold text-base mt-4">
            2. Disclaimers and Risk Disclosure
          </p>

          <div className="mb-2 p-3 border border-red-600 bg-red-900 bg-opacity-20 rounded">
            <p className="mb-2 font-bold text-red-500">
              2.1. Investment Risk Disclaimer
            </p>
            <p className="mb-2 text-red-400">
              <strong>ALL INVESTMENTS CARRY RISK.</strong> The value of
              securities and investments can fall as well as rise, and the
              Client may not recover the amount originally invested. Past
              performance is not an indicator or guarantee of future results.
              Tenger Capital does not guarantee the return of the Client&apos;s
              principal or any investment profits.
            </p>
          </div>

          <p className="mb-2">
            <strong>2.2. Non-Reliance on Company Information</strong>
          </p>
          <p className="mb-2">
            Any information, analysis, or recommendations provided by Tenger
            Capital are based on sources believed to be reliable, but no
            representation or warranty, express or implied, is made as to their
            accuracy, completeness, or fairness.{" "}
            <strong>
              The Client shall not rely solely on the information provided by
              Tenger Capital
            </strong>{" "}
            and must conduct their own independent assessment of the
            appropriateness of any transaction in light of their personal
            objectives, financial circumstances, and risk tolerance.
          </p>

          <p className="mb-2">
            <strong>2.3. No Fiduciary Duty (General Brokerage)</strong>
          </p>
          <p className="mb-2">
            Unless Tenger Capital explicitly enters into a written discretionary
            portfolio management agreement creating a fiduciary relationship,
            Tenger Capital acts as an{" "}
            <strong>execution-only or advisory-only service provider</strong>.
            In such cases, Tenger Capital has no fiduciary duty to the Client
            regarding the suitability of self-directed trades or unsolicited
            investment decisions made by the Client.
          </p>

          <p className="mb-2">
            <strong>2.4. Market and Economic Conditions</strong>
          </p>
          <p className="mb-2">
            Tenger Capital shall not be liable for any loss arising from events
            beyond its reasonable control, including, but not limited to,
            government restrictions, changes in Mongolian or international
            financial regulations, market volatility, force majeure events, or
            technological failures.
          </p>

          <hr className="border-gray-700 my-4" />

          <p className="mb-2 font-bold text-base mt-4">
            3. Client Obligations and Representations
          </p>

          <p className="mb-2">
            <strong>3.1. Know Your Client (KYC) and Due Diligence</strong>
          </p>
          <p className="mb-2">
            In compliance with the{" "}
            <strong>
              Law on Combating Money Laundering and Terrorist Financing
            </strong>
            , the Client must provide accurate, complete, and current personal
            and financial information, including the source of funds. The Client
            agrees to promptly notify Tenger Capital of any changes to this
            information.
          </p>

          <p className="mb-2">
            <strong>3.2. Legal Capacity and Authority</strong>
          </p>
          <p className="mb-2">
            The Client represents and warrants that they have the full legal
            capacity and authority to enter into this Agreement and to engage in
            all transactions contemplated herein.
          </p>

          <p className="mb-2">
            <strong>3.3. Client Assets Segregation</strong>
          </p>
          <p className="mb-2">
            In accordance with the <strong>Law on the Securities Market</strong>
            , Tenger Capital is required to segregate client assets from the
            Company&apos;s proprietary assets. Client assets will be held in
            separate accounts or custodians to ensure the protection of investor
            interests.
          </p>

          <p className="mb-2">
            <strong>3.4. Confidentiality and Data Protection</strong>
          </p>
          <p className="mb-2">
            Tenger Capital shall maintain the confidentiality of Client
            information in accordance with Mongolian law. However, the Client
            acknowledges that Tenger Capital may be required to disclose
            information to the{" "}
            <strong>
              Financial Regulatory Commission (FRC), the Bank of Mongolia, or
              other governmental and judicial authorities
            </strong>{" "}
            as required by law.
          </p>

          <hr className="border-gray-700 my-4" />

          <p className="mb-2 font-bold text-base mt-4">
            4. Execution and Settlement of Transactions
          </p>

          <p className="mb-2">
            <strong>4.1. Best Execution</strong>
          </p>
          <p className="mb-2">
            Tenger Capital shall strive to execute Client orders in accordance
            with the principles of <strong>best execution</strong>, considering
            price, cost, speed, likelihood of execution and settlement, size,
            nature, and any other relevant consideration, in compliance with the{" "}
            <strong>Law on the Securities Market</strong>.
          </p>

          <p className="mb-2">
            <strong>4.2. Fees and Charges</strong>
          </p>
          <p className="mb-2">
            The Client agrees to pay all fees, commissions, and charges
            associated with the services and transactions as outlined in Tenger
            Capital&apos;s separate fee schedule, which may be amended from time
            to time with reasonable notice to the Client.
          </p>

          <p className="mb-2">
            <strong>4.3. Market Manipulation and Insider Trading</strong>
          </p>
          <p className="mb-2">
            The Client is strictly prohibited from engaging in any activity that
            constitutes{" "}
            <strong>
              market manipulation, insider trading, or other fraudulent
              practices
            </strong>{" "}
            under the Applicable Laws. Any such activity may result in the
            immediate termination of services and reporting to the FRC and law
            enforcement authorities.
          </p>

          <hr className="border-gray-700 my-4" />

          <p className="mb-2 font-bold text-base mt-4">
            5. Termination and Governing Law
          </p>

          <p className="mb-2">
            <strong>5.1. Termination</strong>
          </p>
          <p className="mb-2">
            Tenger Capital may terminate this Agreement immediately upon written
            notice to the Client if the Client breaches any provision of this
            Agreement or if required by the FRC or other regulatory authority.
          </p>

          <p className="mb-2">
            <strong>5.2. Governing Law</strong>
          </p>
          <p className="mb-2">
            This Agreement and all disputes, claims, or controversies arising
            out of or relating to this Agreement, or the breach thereof, shall
            be governed by and construed in accordance with the{" "}
            <strong>laws of Mongolia</strong>, without regard to its conflict of
            laws principles.
          </p>

          <p className="mb-2">
            <strong>5.3. Dispute Resolution</strong>
          </p>
          <p className="mb-2">
            Any dispute, controversy, or claim arising out of or relating to
            this Agreement shall first be subject to good faith negotiation
            between the parties. If the dispute cannot be resolved, it shall be
            submitted to the competent <strong>courts of Mongolia</strong> in
            Ulaanbaatar.
          </p>

          <p className="mb-2"></p>
          <p className="mb-2 text-center font-bold p-2 bg-opacity-20 rounded">
            By continuing to use Tenger Capital&apos;s services, you affirm your
            acceptance of these Terms and Conditions.
          </p>

          <ul></ul>
          <ul></ul>
          <ul></ul>
          <ul></ul>
          <ul></ul>
          <ul></ul>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
