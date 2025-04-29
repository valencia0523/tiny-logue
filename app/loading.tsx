const loading = () => {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-white dark:bg-[#1e2230]">
      <div className="w-15 h-15 border-4 border-[#EFD6C0] border-t-transparent rounded-full animate-spin"></div>
    </div>
  );
};

export default loading;
