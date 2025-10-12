import Seperator from "../seperator";

const Brief = () => {
  return (
    <div className="flex flex-col gap-8">
      <Seperator />

      <div className="grid grid-cols-2">
        <div>
          <h1 className="text-4xl">Managed Wealth</h1>
          <h1 className="text-4xl opacity-[0.4]">Real Humans. Real Time. </h1>
        </div>

        <p className="text-lg leading-[1.4] w-[400px]">
          Titan gives you professional advice, whether it’s equity compensation
          or buying a home. You’re not left guessing. Just smart moves, made
          simple.
        </p>
      </div>
    </div>
  );
};

export default Brief;
