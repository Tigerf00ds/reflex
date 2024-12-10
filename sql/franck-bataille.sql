-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Hôte : 127.0.0.1
-- Généré le : lun. 09 déc. 2024 à 22:50
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
  `date_booked` date NOT NULL,
  `time_depart` int(11) NOT NULL,
  `time_start` int(11) NOT NULL,
  `time_end` int(11) NOT NULL,
  `time_return` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Déchargement des données de la table `appointments`
--

INSERT INTO `appointments` (`id`, `care_id`, `address`, `name`, `email`, `telephone`, `date_booked`, `time_depart`, `time_start`, `time_end`, `time_return`) VALUES
(1, 0, '1234 rue de l&#39;adresse 56789', 'aaa', 'aaa@aaa.a', '0612345678', '2024-12-10', 400, 400, 500, 500),
(2, 0, '1234 rue de l&#39;adresse 56789', 'aaa', 'aaa@aaa.a', '0612345678', '2024-12-10', 200, 200, 400, 400),
(3, 0, '1234 rue de l&#39;adresse 56789', 'aaa', 'aaa@aaa.a', '0612345678', '2024-12-10', 200, 200, 400, 400),
(4, 0, '1234 rue de l&#39;adresse 56789', 'aaa', 'aaa@aaa.a', '0612345678', '2024-12-10', 200, 200, 400, 400),
(5, 0, '1234 rue de l&#39;adresse 56789', 'aaa', 'aaa@aaa.a', '0612345678', '2024-12-10', 200, 200, 400, 400),
(6, 0, '1234 rue de l&#39;adresse 56789', 'aaa', 'aaa@aaa.a', '0612345678', '2024-12-10', 200, 200, 400, 400),
(7, 0, '1234 rue de l&#39;adresse 56789', 'aaa', 'aaa@aaa.a', '0612345678', '2024-12-10', 200, 200, 400, 400),
(8, 0, '1234 rue de l&#39;adresse 56789', 'aaa', 'aaa@aaa.a', '0612345678', '2024-12-10', 200, 200, 400, 400),
(9, 0, '1234 rue de l&#39;adresse 56789', 'aaa', 'aaa@aaa.a', '0612345678', '2024-12-10', 200, 200, 400, 400),
(10, 0, '1234 rue de l&#39;adresse 56789', 'aaa', 'aaa@aaa.a', '0612345678', '2024-12-10', 200, 200, 400, 400),
(11, 0, '1234 rue de l&#39;adresse 56789', 'aaa', 'aaa@aaa.a', '0612345678', '2024-12-10', 200, 200, 400, 400),
(12, 0, '1234 rue de l&#39;adresse 56789', 'aaa', 'aaa@aaa.a', '0612345678', '2024-12-10', 200, 200, 400, 400);

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
  `tax` int(11) NOT NULL,
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

INSERT INTO `cares` (`id`, `name`, `slug`, `short_description`, `description`, `min_duration`, `max_duration`, `price`, `tax`, `travel_expenses`, `is_whole_day`, `is_home`, `is_salon`, `is_company`, `is_structure`, `filespaths`, `filesnames`, `filesdescriptions`) VALUES
(1, 'a', 'a', '1', '1', 15, 30, 1000, 100, 500, 0, 1, 1, 0, 1, '[]', '[]', '[\"aaa\",\"bbb\",\"ccc\",\"ddd\"]'),
(3, 'A a', 'a-a', '1', '1', 15, 30, 1000, 100, 500, 0, 1, 1, 0, 1, '[]', '[]', '[\"aaa\",\"bbb\",\"ccc\",\"ddd\"]'),
(4, 'A&#39;b c', 'a-b-c', '1', '1', 15, 30, 1000, 100, 500, 0, 1, 1, 0, 1, '[]', '[]', '[\"aaa\",\"bbb\",\"ccc\",\"ddd\"]'),
(5, 'A-B C&#39;d', 'a-b-c-d', '1', '1', 15, 30, 1000, 100, 500, 0, 1, 1, 0, 1, '[]', '[]', '[\"aaa\",\"bbb\",\"ccc\",\"ddd\"]');

-- --------------------------------------------------------

--
-- Structure de la table `events`
--

CREATE TABLE `events` (
  `id` int(11) NOT NULL,
  `title` varchar(255) NOT NULL,
  `text` text NOT NULL,
  `filespaths` text NOT NULL,
  `filesnames` text NOT NULL,
  `filesdescriptions` text NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Structure de la table `guestbook`
--

CREATE TABLE `guestbook` (
  `id` int(11) NOT NULL,
  `care_type` varchar(30) NOT NULL,
  `name` varchar(255) NOT NULL,
  `title` varchar(255) NOT NULL,
  `text` text NOT NULL,
  `telephone` varchar(10) NOT NULL,
  `isDisplayed` tinyint(1) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

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
(1, 'franck5bat@yahoo.fr', '$2b$10$Wwju/mcTV/6eZGlZPKXCJuy4aLdlJI82sokHxdislEq0mB0NpZ8ty');

--
-- Index pour les tables déchargées
--

--
-- Index pour la table `appointments`
--
ALTER TABLE `appointments`
  ADD PRIMARY KEY (`id`);

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
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=13;

--
-- AUTO_INCREMENT pour la table `cares`
--
ALTER TABLE `cares`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=13;

--
-- AUTO_INCREMENT pour la table `events`
--
ALTER TABLE `events`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT pour la table `guestbook`
--
ALTER TABLE `guestbook`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT pour la table `users`
--
ALTER TABLE `users`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
