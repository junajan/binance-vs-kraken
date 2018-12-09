SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET time_zone = "+00:00";

--
-- Database: `cryptostream`
--

-- --------------------------------------------------------

--
-- Table structure for table `crypto_rates`
--

CREATE TABLE `crypto_rates` (
  `id` bigint(20) NOT NULL,
  `date` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `kraken_USDTZUSD` decimal(10,5) NOT NULL,
  `kraken_XXLMZUSD` decimal(10,5) NOT NULL,
  `kraken_XXRPZUSD` decimal(10,5) NOT NULL,
  `binance_XRPUSDT` decimal(10,5) NOT NULL,
  `binance_XLMUSDT` decimal(10,5) NOT NULL,
  `binance_TUSDUSDT` decimal(10,5) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Indexes for dumped tables
--

--
-- Indexes for table `crypto_rates`
--
ALTER TABLE `crypto_rates`
  ADD PRIMARY KEY (`id`),
  ADD KEY `date` (`date`);

--
-- AUTO_INCREMENT for table `crypto_rates`
--
ALTER TABLE `crypto_rates`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=1;