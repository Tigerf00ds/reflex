-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Hôte : 127.0.0.1
-- Généré le : mer. 18 déc. 2024 à 17:14
-- Version du serveur : 10.4.27-MariaDB
-- Version de PHP : 8.2.0

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Base de données : `franck-bataille`
--

-- --------------------------------------------------------

--
-- Structure de la table `appointments`
--

CREATE TABLE `appointments` (
  `id` int(11) NOT NULL,
  `care_id` int(11) NOT NULL,
  `address` text NOT NULL,
  `name` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `telephone` varchar(13) NOT NULL,
  `date_booked` varchar(10) NOT NULL,
  `time_depart` int(11) NOT NULL,
  `time_start` int(11) NOT NULL,
  `time_end` int(11) NOT NULL,
  `time_return` int(11) NOT NULL,
  `price` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Déchargement des données de la table `appointments`
--

INSERT INTO `appointments` (`id`, `care_id`, `address`, `name`, `email`, `telephone`, `date_booked`, `time_depart`, `time_start`, `time_end`, `time_return`, `price`) VALUES
(1, 1, '1234 rue de l&#39;adresse 56789', 'Aaaaaaaa Aaa', 'aaa@aaa.a', '0600000000', '2024-12-10', 400, 400, 500, 500, 3000),
(2, 1, '1234 rue de l&#x27;adresse 56789', 'Bbbbbbbb Bbbbbbbb', 'aaa@aaa.a', '0600000001', '2025-12-09', 130, 200, 400, 430, 3500),
(3, 4, 'salon', 'Charlie et Lulu', 'aaa@aaa.a', '0600000002', '2025-12-05', 0, 0, 2400, 2400, 24000),
(4, 5, 'salonn', 'aaa', 'aaa@aaa.a', '0600000003', '2025-12-07', 440, 510, 710, 740, 3500),
(5, 5, '1234 rue de l&#x27;adresse 56789', 'Basil Hikes', 'aaa@aaa.a', '0600000011', '2024-12-12', 330, 400, 500, 530, 2500),
(6, 1, 'Chez madame Aaa', 'Aaa', 'aaa@aaa.a', '0600000010', '2024-12-19', 0, 0, 2400, 2400, 121500),
(7, 4, 'salon', 'aaa', 'aaa@aaa.a', '0600000004', '2025-12-01', 45, 45, 400, 400, 3250),
(8, 3, '1234 rue de l&#x27;adresse 56789', 'aaa', 'aaa@aaa.a', '0600000014', '2026-12-08', 130, 200, 400, 430, 3500),
(9, 1, '1234 rue de l&#x27;adresse 56789', 'aaa', 'aaa@aaa.a', '0600000005', '2024-12-21', 1330, 1400, 1600, 1630, 3500),
(10, 0, 'salon', 'aaa', 'aaa@aaa.a', '0600000007', '2026-12-09', 0, 0, 2400, 2400, 0),
(11, 3, 'salon', 'A&#xEF;cha Dmin', 'a.dmin@gmail.com', '0600000008', '2024-12-18', 1545, 1545, 1650, 1650, 6500),
(12, 5, '1234 rue de l&#x27;adresse 56789', 'Fsdsdfsd Ddsfd', 'aaa@aaa.a', '0600000009', '2025-12-16', 730, 800, 830, 900, 2000),
(13, 5, 'salon', 'F&#xE9;licie Velgado', 'aaa@aaa.a', '0600000013', '2024-12-15', 1430, 1430, 1555, 1555, 1417),
(14, 5, '1234 rue de l&#x27;adresse 56789', 'Charline', 'aaa@aaa.a', '0600000015', '2024-12-15', 1630, 1700, 1830, 1900, 3000),
(15, 5, '1234 rue de l&#x27;adresse 56789', 'Ch&#x27;ulu F&#x27;tha-gn', 'aaa@aaa.a', '0600000006', '2024-12-17', 730, 800, 830, 900, 2000),
(16, 5, 'salon', 'Test Tester', 'aaa@aaa.a', '0600000012', '2027-12-11', 930, 930, 1000, 1000, 3750),
(17, 5, 'salon', 'Devon Derrere', 'aaa@aaa.a', '0600000013', '2024-12-12', 1100, 1100, 1200, 1200, 1000);

-- --------------------------------------------------------

--
-- Structure de la table `banned_users`
--

CREATE TABLE `banned_users` (
  `id` int(11) NOT NULL,
  `telephone` varchar(13) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Déchargement des données de la table `banned_users`
--

INSERT INTO `banned_users` (`id`, `telephone`) VALUES
(8, '0614042032');

-- --------------------------------------------------------

--
-- Structure de la table `cares`
--

CREATE TABLE `cares` (
  `id` int(11) NOT NULL,
  `name` varchar(255) NOT NULL,
  `slug` varchar(255) NOT NULL,
  `short_description` varchar(255) NOT NULL,
  `description` text NOT NULL,
  `min_duration` int(11) NOT NULL,
  `max_duration` int(11) NOT NULL,
  `price` int(11) NOT NULL,
  `day_price` int(11) NOT NULL,
  `travel_expenses` int(11) NOT NULL DEFAULT 0,
  `is_whole_day` tinyint(1) NOT NULL,
  `is_home` tinyint(1) NOT NULL,
  `is_salon` tinyint(1) NOT NULL,
  `is_company` tinyint(1) NOT NULL,
  `is_structure` tinyint(1) NOT NULL,
  `filespaths` text NOT NULL,
  `filesnames` text NOT NULL,
  `filesdescriptions` text NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Déchargement des données de la table `cares`
--

INSERT INTO `cares` (`id`, `name`, `slug`, `short_description`, `description`, `min_duration`, `max_duration`, `price`, `day_price`, `travel_expenses`, `is_whole_day`, `is_home`, `is_salon`, `is_company`, `is_structure`, `filespaths`, `filesnames`, `filesdescriptions`) VALUES
(1, 'Massage du dos et des &#xE9;paules', 'massage-du-dos-et-des-epaules', 'Un massage du dos et des &#xE9;paules.', '1', 15, 60, 5000, 30000, 1500, 1, 1, 1, 1, 1, '[]', '[]', '[\"aaa\",\"bbb\",\"ccc\",\"ddd\"]'),
(3, 'Massage du dos et des &#xE9;paules aussi', 'massage-du-dos-et-des-epaules-aussi', 'Un autre type de massage du dos et des &#xE9;paules.', '1', 30, 120, 6000, 0, 1500, 0, 0, 1, 0, 0, '[]', '[]', '[\"aaa\",\"bbb\",\"ccc\",\"ddd\"]'),
(4, 'Soin de groupe du dos et des &#xE9;paules', 'soin-de-groupe-du-dos-et-des-epaules', 'C&#x27;est juste pour teser, ce n&#x27;est pas d&#xE9;finitif. Un autre type de massage du dos et des &#xE9;paules.', '1', 30, 120, 8000, 48000, 1500, 1, 0, 0, 1, 1, '[]', '[]', '[\"aaa\",\"bbb\",\"ccc\",\"ddd\"]'),
(5, 'Soin de groupe du dos et des &#xE9;paules aussi', 'soin-de-groupe-du-dos-et-des-epaules-aussi', 'C&#x27;est juste pour teser, ce n&#x27;est pas d&#xE9;finitif. Un autre type de massage du dos et des &#xE9;paules.', '1', 15, 30, 7500, 0, 1500, 0, 0, 1, 0, 0, '[]', '[]', '[\"aaa\",\"bbb\",\"ccc\",\"ddd\"]');

-- --------------------------------------------------------

--
-- Structure de la table `events`
--

CREATE TABLE `events` (
  `id` int(11) NOT NULL,
  `title` varchar(255) NOT NULL,
  `short_text` varchar(255) NOT NULL,
  `text` text NOT NULL,
  `filespaths` text NOT NULL,
  `filesnames` text NOT NULL,
  `filesdescriptions` text NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Déchargement des données de la table `events`
--

INSERT INTO `events` (`id`, `title`, `short_text`, `text`, `filespaths`, `filesnames`, `filesdescriptions`) VALUES
(1, 'test event', 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Cum quaerat iusto odit molestias? Reprehenderit vel suscipit laborum eveniet rem, illum laudantium dolorem architecto animi. Molestiae numquam adipisci voluptates fugiat sit?', 'test', '[]', '[]', '[]');

-- --------------------------------------------------------

--
-- Structure de la table `guestbook`
--

CREATE TABLE `guestbook` (
  `id` int(11) NOT NULL,
  `care_id` int(11) NOT NULL,
  `name` varchar(255) NOT NULL,
  `title` varchar(255) NOT NULL,
  `text` text NOT NULL,
  `telephone` varchar(10) NOT NULL,
  `is_displayed` tinyint(1) NOT NULL DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Déchargement des données de la table `guestbook`
--

INSERT INTO `guestbook` (`id`, `care_id`, `name`, `title`, `text`, `telephone`, `is_displayed`) VALUES
(1, 1, 'test guest', 'test book', 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Cum quaerat iusto odit molestias? Reprehenderit vel suscipit laborum eveniet rem, illum laudantium dolorem architecto animi. Molestiae numquam adipisci voluptates fugiat sit?', '0600000000', 1),
(2, 3, 'test guest too', 'another title', 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Cum quaerat iusto odit molestias? Reprehenderit vel suscipit laborum eveniet rem, illum laudantium dolorem architecto animi. Molestiae numquam adipisci voluptates fugiat sit? Lorem ipsum dolor sit amet consectetur adipisicing elit. Cum quaerat iusto odit molestias? Reprehenderit vel suscipit laborum eveniet rem, illum laudantium dolorem architecto animi. Molestiae numquam adipisci voluptates fugiat sit? Lorem ipsum dolor sit amet consectetur adipisicing elit. Cum quaerat iusto odit molestias? Reprehenderit vel suscipit laborum eveniet rem, illum laudantium dolorem architecto animi. Molestiae numquam adipisci voluptates fugiat sit?', '0600000001', 1);

-- --------------------------------------------------------

--
-- Structure de la table `miscellaneous_texts`
--

CREATE TABLE `miscellaneous_texts` (
  `id` int(11) NOT NULL,
  `text` text NOT NULL,
  `filespaths` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL CHECK (json_valid(`filespaths`)),
  `filesnames` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL CHECK (json_valid(`filesnames`)),
  `filesdescriptions` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL CHECK (json_valid(`filesdescriptions`))
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Déchargement des données de la table `miscellaneous_texts`
--

INSERT INTO `miscellaneous_texts` (`id`, `text`, `filespaths`, `filesnames`, `filesdescriptions`) VALUES
(1, 'Phrase d&#x27;accroche &#xE0; l&#x27;entr&#xE9;e du site.', '[]', '[]', '[]'),
(2, 'Long texte pour la page informations.', '[]', '[]', '[\"aaa\",\"bbb\",\"ccc\",\"ddd\"]');

-- --------------------------------------------------------

--
-- Structure de la table `users`
--

CREATE TABLE `users` (
  `id` int(11) NOT NULL,
  `email` varchar(255) NOT NULL,
  `password` text NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Déchargement des données de la table `users`
--

INSERT INTO `users` (`id`, `email`, `password`) VALUES
(1, 'franck5bat@yahoo.fr', '$2b$10$ucv2MK6HviFuONePUh8tFuB/RG241LamL6YDggMKWY7G0sFJh96Ja');

--
-- Index pour les tables déchargées
--

--
-- Index pour la table `appointments`
--
ALTER TABLE `appointments`
  ADD PRIMARY KEY (`id`);

--
-- Index pour la table `banned_users`
--
ALTER TABLE `banned_users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `telephone` (`telephone`);

--
-- Index pour la table `cares`
--
ALTER TABLE `cares`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `name` (`name`);

--
-- Index pour la table `events`
--
ALTER TABLE `events`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `title` (`title`);

--
-- Index pour la table `guestbook`
--
ALTER TABLE `guestbook`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `telephone` (`telephone`);

--
-- Index pour la table `miscellaneous_texts`
--
ALTER TABLE `miscellaneous_texts`
  ADD PRIMARY KEY (`id`);

--
-- Index pour la table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `email` (`email`);

--
-- AUTO_INCREMENT pour les tables déchargées
--

--
-- AUTO_INCREMENT pour la table `appointments`
--
ALTER TABLE `appointments`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=18;

--
-- AUTO_INCREMENT pour la table `banned_users`
--
ALTER TABLE `banned_users`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=9;

--
-- AUTO_INCREMENT pour la table `cares`
--
ALTER TABLE `cares`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=13;

--
-- AUTO_INCREMENT pour la table `events`
--
ALTER TABLE `events`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT pour la table `guestbook`
--
ALTER TABLE `guestbook`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT pour la table `miscellaneous_texts`
--
ALTER TABLE `miscellaneous_texts`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT pour la table `users`
--
ALTER TABLE `users`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
