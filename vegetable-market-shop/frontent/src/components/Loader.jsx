export default function Loader() {
  return (
    <div className="flex flex-col items-center justify-center py-14">
      <div className="h-10 w-10 animate-spin rounded-full border-4 border-brand-100 border-t-brand-600" />
      <p className="mt-3 text-sm text-slate-500">Loading...</p>
    </div>
  );
}
