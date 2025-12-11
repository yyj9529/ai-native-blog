export default function Footer() {
  return (
    <footer className="w-full bg-gray-900 text-white mt-auto">
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="flex flex-col items-center gap-8">
          {/* CTA 버튼 */}
          <button className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-md shadow-md">
            문의하기
          </button>

          {/* 저작권 표시 */}
          <div className="text-gray-400 text-sm text-center">
            <p>&copy; {new Date().getFullYear()} My Awesome Site. All rights reserved.</p>
          </div>
        </div>
      </div>
    </footer>
  );
}
