const Loader = ({ label = "Loading" }) => {
  return (
    <div className="flex flex-col items-center justify-center gap-3 py-8 text-ink">
      <div className="relative h-12 w-12">
        <div className="absolute inset-0 rounded-full border-4 border-ink/15" />
        <div className="absolute inset-0 rounded-full border-4 border-pine border-t-transparent animate-spin" />
      </div>
      {label ? (
        <p className="text-sm font-medium text-ink/70">{label}</p>
      ) : null}
    </div>
  );
};

export default Loader;
