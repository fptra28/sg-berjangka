export default function TradingView() {
    return (
        <div className="w-full bg-linear-to-r from-zinc-900 to-zinc-800 text-gray-300">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-0 py-12">
                <div className="flex flex-col lg:flex-row gap-5">
                    {/* Gambar dan Teks */}
                    <div className="w-full">
                        <img
                            src="/assets/TradingView.png"
                            alt="TradingView"
                            className="w-50 object-contain"
                        />
                        <p className="mt-4">
                            Chart yang kami gunakan disediakan oleh TradingView, sebuah platform charting bagi para trader dan investor dari seluruh penjuru dunia.
                            Temukan berbagai instrumen finansial seperti chart <strong>EURUSD</strong>, <strong>BTCUSDT</strong>, <strong>IHSG</strong>, dan juga peralatan seperti Stock Screener yang tersedia secara gratis dan
                            dapat membantu dalam aktivitas trading dan investasi anda.
                        </p>
                    </div>

                    {/* Tombol "Live Chart" */}
                    <div className="flex items-center md:justify-center">
                        <a
                            href="https://id.tradingview.com/chart/"
                            target="_blank"
                            className="bg-red-500 text-white text-center px-6 py-3 rounded-lg hover:bg-red-600 transition duration-300 max-w-max"
                        >
                            Live Chart
                        </a>
                    </div>
                </div>
            </div>
        </div>
    );
}
