var orgChartData = [
	{
		id: "1",
		text: "Chairman & CEO",
		title: "Henry Bennett",
		img: "../common/img/avatar-1.png"
	},
	{
		id: "2",
		text: "Manager",
		title: "Mildred Kim",
		img: "../common/img/avatar-2.png"
	},
	{
		id: "3",
		text: "Technical Director",
		title: "Jerry Wagner",
		img: "../common/img/avatar-3.png"
	},
	{
		id: "2.1",
		text: "Marketer",
		title: "Charles Little",
		img: "../common/img/avatar-4.png"
	},
	{
		id: "3.1",
		text: "Team Lead ",
		title: "Jonathan Lane",
		img: "../common/img/avatar-5.png"
	},
	{ id: "1-2", from: "1", to: "2", type: "line", points: [{ x: 100, y: 100 }] },
	{ id: "1-3", from: "1", to: "3", type: "line" },
	{ id: "2-2.1", from: "2", to: "2.1", type: "line" },
	{ id: "3-3.1", from: "3", to: "3.1", type: "line" },
];

var bitOrgChartData = [
	{
		"id": "1",
		"text": "Chairman & CEO",
		"title": "Henry Bennett",
		"img": "../common/img/avatar-1.png"
	},
	{
		"id": "2",
		"text": "QA Lead",
		"title": "Emma Lynch",
		"img": "../common/img/avatar-2.png",
		"parent": 1,
		"dir": "vertical"
	},
	{
		"id": "2.1",
		"text": "QA",
		"title": "Charles Little",
		"img": "../common/img/avatar-4.png",
		"parent": 2
	},
	{
		"id": "2.2",
		"text": "QA",
		"title": "Douglas Riley",
		"img": "../common/img/avatar-9.png",
		"parent": 2
	},
	{
		"id": "2.3",
		"text": "QA",
		"title": "Eugene Foster",
		"img": "../common/img/avatar-12.png",
		"parent": 2
	},
	{
		"id": "3",
		"text": "Technical Director",
		"title": "Jerry Wagner",
		"img": "../common/img/avatar-3.png",
		"parent": 1
	},
	{
		"id": "3.1",
		"text": "Team Lead",
		"title": "Mark Nichols",
		"img": "../common/img/avatar-7.png",
		"parent": 3
	},
	{
		"id": "3.1.1",
		"text": "Programmer",
		"title": "Sean Parker",
		"img": "../common/img/avatar-10.png",
		"parent": 3.1,
		"open": false
	},
	{
		"id": "3.1.1.1",
		"text": "Junior",
		"title": "Laura Alvarez",
		"img": "../common/img/avatar-8.png",
		"parent": "3.1.1"
	},
	{
		"id": "4",
		"text": "Manager",
		"title": "Jonathan Lane",
		"img": "../common/img/avatar-5.png",
		"parent": "1",
		"dir": "vertical"
	},
	{
		"id": "4.1",
		"text": "Marketer",
		"title": "Sandra Butler",
		"img": "../common/img/avatar-6.png",
		"parent": "4"
	},
	{
		"id": "4.2",
		"text": "Designer",
		"title": "Julie Green",
		"img": "../common/img/avatar-16.png",
		"parent": "4"
	},
	{
		"id": "4.3",
		"text": "Sales Manager",
		"title": "Richard Hicks",
		"img": "../common/img/avatar-14.png",
		"parent": "4"
	},
	{
		"id": "3.2",
		"text": "Team Lead",
		"title": "Nicholas Cruz",
		"img": "../common/img/avatar-13.png",
		"parent": 3
	},
	{
		"id": "3.2.1",
		"text": "Programmer",
		"title": "Michael Shaw",
		"img": "../common/img/avatar-11.png",
		"parent": "3.2"
	},
	{
		"id": "3.2.1.1",
		"text": "Junior",
		"title": "John Flores",
		"img": "../common/img/avatar-15.png",
		"parent": "3.2.1"
	}
];

var customDiagramData = [
	{
		id: "a",
		x: 264,
		y: 53,
		type: "rect",
		text: "a test",
		height: 50,
		width: 50,
		css: "square"
	},
	{
		id: "b",
		x: 267,
		y: 158,
		type: "rect",
		text: "b test text",
		height: 50,
		width: 50,
		css: "baseShape"
	},
	{
		id: "c",
		x: 100,
		y: 100,
		type: "rect",
		text: "c",
		height: 50,
		width: 50,
		css: "baseShape"
	},
	{
		id: "f",
		x: 100,
		y: 100,
		type: "rect",
		text: "f",
		height: 50,
		width: 150,
		css: "baseShape"
	},
	{
		id: "d",
		x: 164,
		y: 83,
		type: "triangle",
		text: "test",
		height: 100,
		width: 100,
		css: "baseShape"
	},
	{
		id: "e",
		x: 400,
		y: 400,
		type: "circle",
		text: "test",
		height: 100,
		width: 100,
		css: "baseShape"
	},
	{ id: "ab", points: [{ x: 264, y: 103 }, { x: 317, y: 208 }], type: "line" },
];

var simpleOrgChartData = [
	{
		id: 1,
		text: "Chairman & CEO",
	},
	{
		id: 2,
		text: "Manager",
		parent: 1
	},
	{
		id: 3,
		text: "Technical Director",
		parent: 1
	},
	{
		id: 2.1,
		text: "Marketer",
		parent: 2
	},
	{
		id: 3.1,
		text: "Team Lead ",
		parent: 3
	},
];
