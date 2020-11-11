DROP TABLE products;

CREATE TABLE products (
	id uuid NOT NULL DEFAULT uuid_generate_v4(),
	count int4 NULL,
	description text NULL,
	price float4 NULL,
	title text NULL,
	published text NULL,
	edition int2 NULL,
	publisher text NULL,
	authors _text NULL,
	cover_url text NULL,
	rating float4 NULL,
	CONSTRAINT products_pkey PRIMARY KEY (id)
);

INSERT INTO products (count, description, price, title, published, edition, publisher, authors, cover_url, rating) values
	(34, 'Learn proven patterns, techniques, and tricks to take full advantage of the Node.js platform. Master well-known design principles to create applications that are readable, extensible, and that can grow big', 49.99, 'Node.js Design Patterns: Design and implement production-grade Node.js applications using proven patterns and techniques', 'July 29, 2020', 3, 'Paperback', '{"Mario Casciaro", "Luciano Mammino"}', 'https://images-na.ssl-images-amazon.com/images/I/515wgVc7S9L._SX404_BO1,204,203,200_.jpg', 4.4),
	(46, 'Build scalable web applications using Node.js, Express.js, and the latest ECMAScript techniques, along with deploying applications with AWS and Docker with this updated fifth edition', 29.99, 'Node.js Web Development: Server-side web development', 'July 31, 2020', 5, 'Paperback', '{"David Herron"}', 'https://images-na.ssl-images-amazon.com/images/I/41e+IedpQXL._SX404_BO1,204,203,200_.jpg', 5),
	(47, 'Explore what React, Node, TypeScript, Webpack, and Docker have to offer individually, and how they all fit together in modern app development.', 24.27, 'Modern Full-Stack Development: Using TypeScript, React, Node.js, Webpack, and Docker', 'Mar 30, 2020', 1, 'Paperback', '{"Frank Zammetti"}', 'https://images-na.ssl-images-amazon.com/images/I/41q4NK-yIAL._SX348_BO1,204,203,200_.jpg', 4.6),
	(22, 'JavaScript is the programming language of the web and is used by more software developers today than any other programming language. For nearly 25 years this best seller has been the go-to guide for JavaScript programmers. The seventh edition is fully updated to cover the 2020 version of JavaScript, and new chapters cover classes, modules, iterators, generators, Promises, async/await, and metaprogramming. You’ll find illuminating and engaging example code throughout.', 39.71, 'JavaScript: The Definitive Guide: Master the Worlds Most-Used Programming Language', 'Jun 2, 2020', 7, 'Paperback', '{"David Flanagan"}', 'https://images-na.ssl-images-amazon.com/images/I/51wijnc-Y8L._SX379_BO1,204,203,200_.jpg', 4.7),
	(11, 'Get Programming with Node.js teaches you to write server-side code in JavaScript using Node.js. In 37 fast-paced, fun, and practical lessons, you will discover how to extend your existing JavaScript skills to write back-end code for your web applications.', 45.28, 'Get Programming with Node.js', 'Mar 15, 2019', 1, 'Paperback', '{"Jonathan Wexler"}', 'https://images-na.ssl-images-amazon.com/images/I/41-OvBpNo9L._SX397_BO1,204,203,200_.jpg', 4.5),
	(8, 'In this book, we take you on a fun, hands-on and pragmatic journey to learning Node.js, Express and MongoDB development. You will start building your first Node.js app within minutes. Every chapter is written in a bite-sized manner and straight to the point as I don’t want to waste your time (and most certainly mine) on the content you do not need. In the end, you will have the skills to create a blog app and deploy it to the Internet.', 17.99, 'Beginning Node.js, Express & MongoDB Development', 'Jul 10, 2019', 1, 'Paperback', '{"Greg Lim"}', 'https://images-na.ssl-images-amazon.com/images/I/41c5+a3VaXL._SX404_BO1,204,203,200_.jpg', 4.4),
	(45, 'Beginning Node.js is your step-by-step guide to learning all the aspects of creating maintainable Node.js applications. You will see how Node.js is focused on creating high-performing, highly-scalable websites, and how easy it is to get started. Many front-end devs regularly work with HTML, CSS, PHP, even WordPress, but have not yet got started with Node.js. This book explains everything for you from a beginner level, enabling you to start using Node.js in your projects right away.', 42.61, 'Beginning Node.js', 'Nov 25, 2014', 1, 'Paperback', '{"Basarat Syed"}', 'https://images-na.ssl-images-amazon.com/images/I/41c5+a3VaXL._SX404_BO1,204,203,200_.jpg', 3.8),
	(3, 'Build fast, robust, and maintainable modern full-stack web applications using MongoDB, Express, Angular, and Node.js.', 34.99, 'MongoDB, Express, Angular, and Node.js Fundamentals: Become a MEAN master and rule the world of web applications', 'Mar 7, 2019', 1, 'Paperback', '{"Paul Oluyege"}', 'https://images-na.ssl-images-amazon.com/images/I/51e6qn4svwL._SX404_BO1,204,203,200_.jpg', 1);