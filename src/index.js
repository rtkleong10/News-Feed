import React from 'react';
import ReactDOM from 'react-dom';
import $ from 'jquery'; // npm i jquery --save (do this in terminal to add first)
import './styles.css';
// Use that chrome extension

var sources = [
	{
		sourceName: "Straits Times",
		categories: [
			{
				categoryName: "Lifestyle",
				url: "http://www.straitstimes.com/news/lifestyle/rss.xml"
			},
			{
				categoryName: "Politics",
				url: "http://www.straitstimes.com/news/politics/rss.xml"
			},
			{
				categoryName: "Forum",
				url: "http://www.straitstimes.com/news/forum/rss.xml"
			},
			{
				categoryName: "Business",
				url: "http://www.straitstimes.com/news/business/rss.xml"
			},
			{
				categoryName: "Opinion",
				url: "http://www.straitstimes.com/news/opinion/rss.xml"
			},
			{
				categoryName: "Asia",
				url: "http://www.straitstimes.com/news/asia/rss.xml"
			},
			{
				categoryName: "Multimedia",
				url: "http://www.straitstimes.com/news/multimedia/rss.xml"
			},
			{
				categoryName: "Sport",
				url: "http://www.straitstimes.com/news/sport/rss.xml"
			},
			{
				categoryName: "Singapore",
				url: "http://www.straitstimes.com/news/singapore/rss.xml"
			},
			{
				categoryName: "Tech",
				url: "http://www.straitstimes.com/news/tech/rss.xml"
			},
			{
				categoryName: "World",
				url: "http://www.straitstimes.com/news/world/rss.xml"
			}
		]
	},
	{
		sourceName: "Channel News Asia",
		categories: [
			{
				categoryName: "Latest News",
				url: "http://www.channelnewsasia.com/rssfeeds/8395986"
			},
			{
				categoryName: "Asia Pacific",
				url: "http://www.channelnewsasia.com/rssfeeds/8395744"
			},
			{
				categoryName: "Business",
				url: "http://www.channelnewsasia.com/rssfeeds/8395954"
			},
			{
				categoryName: "Singapore",
				url: "http://www.channelnewsasia.com/rssfeeds/8396082"
			},
			{
				categoryName: "Sport",
				url: "http://www.channelnewsasia.com/rssfeeds/8395838"
			}
		]
	}
];

class NewsFeed extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			currentSource: this.props.sources[0],
			currentCategory: this.props.sources[0].categories[0]
		}

		this.onChangeSource = this.onChangeSource.bind(this);
		this.onChangeCategory = this.onChangeCategory.bind(this);
	}

	onChangeSource(newSourceName) {

		var sources = this.props.sources;

		for(let source in sources) {

			let sourceName = sources[source].sourceName;

			if(sourceName === newSourceName) {
				this.setState({
					currentSource: sources[source],
					currentCategory: sources[source].categories[0]
				});
			}

		}
	}

	onChangeCategory(newCategoryName) {

		var categories = this.state.currentSource.categories;

		for(let category in categories) {

			let categoryName = categories[category].categoryName;

			if(categoryName === newCategoryName) {
				this.setState({currentCategory: categories[category]});

			}

		}
	}

	render() {
		var sources = this.props.sources;
		var url = this.state.currentCategory.url;

		return (
			<div>
				<header>
					<div className="container">
						<h1>News Reader</h1>
						<Filter sources={sources} currentSource={this.state.currentSource} onChangeSource={this.onChangeSource} onChangeCategory={this.onChangeCategory}/>
					</div>
				</header>
				<section>
					<div className="container">
						<ArticleList url={url} currentSourceName={this.state.currentSource.sourceName}/>
					</div>
				</section>
			</div>
		);
	}
}

class Filter extends React.Component {

	render() {
		var sources = this.props.sources;
		var sourceNames = [];
		var categoryNames = [];

		for(let source in sources) {

			let sourceName = sources[source].sourceName;
			sourceNames.push(sourceName);

			if(sourceName === this.props.currentSource.sourceName) {

				let categories = sources[source].categories;

				for(let category in categories) {
					let categoryName = categories[category].categoryName;
					categoryNames.push(categoryName);
				}

			}

		}

		return (
			<div>
				<SourceFilter sourceNames={sourceNames} onChangeSource={this.props.onChangeSource} />
				<CategoryFilter categoryNames={categoryNames} onChangeCategory={this.props.onChangeCategory} currentSourceName={this.props.currentSource.sourceName}/>
			</div>
		);
	}
}

class SourceFilter extends React.Component {

	constructor(props) {
		super(props);
		this.onChangeSource = this.onChangeSource.bind(this);
	}

	onChangeSource(e) {
		this.props.onChangeSource(e.target.value);
	}

	render() {
		var sourceNames = this.props.sourceNames;
		var options = [];

		sourceNames.forEach(function(sourceName) {
			options.push(<option name={sourceName} key={sourceName}>{sourceName}</option>);
		});

		return (
			<div>
				<label>Source: </label>
				<select name="sourceNames" onChange={this.onChangeSource}>
					{options}
				</select>
			</div>
		);
	}

}

class CategoryFilter extends React.Component {

	constructor(props) {
		super(props);
		this.onChangeCategory = this.onChangeCategory.bind(this);
	}

	onChangeCategory(e) {
		this.props.onChangeCategory(e.target.value);
	}

	render() {
		var categoryNames = this.props.categoryNames;
		var options = [];
		var currentSourceName = this.props.currentSourceName;
		categoryNames.forEach(function(categoryName) {
			options.push(<option name={categoryName} key={currentSourceName + " " + categoryName}>{categoryName}</option>);
		});

		return (
			<div>
				<label>Category: </label>
				<select name="categoryNames" onChange={this.onChangeCategory}>
					{options}
				</select>
			</div>
		);
	}

}

class ArticleList extends React.Component {

	constructor(props) {
		super(props);
		this.state = {
			articleItems: []
		};

	}

	fetchDataFromUrl(url) {
		$.ajax({
			type: "GET",
			url: url,
			dataType: "xml" ,

			success: function(data) {
				this.setState({articleItems: data.getElementsByTagName("item")});
			}.bind(this),

			error: function(xhr, status, err) {
				console.error(url, status, err.toString());
			}

		});
	}

	componentDidMount() {
		this.fetchDataFromUrl(this.props.url);
	}

	componentWillReceiveProps(nextProps) {
		if(this.props !== nextProps) {
			this.fetchDataFromUrl(nextProps.url);
		}
	}

	render() {
		var articleItems = this.state.articleItems;
		var articles = [];

		for(let i = 0; i < articleItems.length; i++) {
			var article = articleItems[i];
			var title = article.children[0].textContent;
			articles.push(<Article article={article} currentSourceName={this.props.currentSourceName} key={title}/>)
		}


		if(articles.length === 0) {
			return (
				<div>
					<p>Sorry, no articles found for that category.</p>
				</div>
			);
		} else {
			return (
				<div className="article-list">
					{articles}
				</div>
			);
		}
	}

}

class Article extends React.Component {

	render() {
		var article = this.props.article;
		var title = article.getElementsByTagName("title")[0].textContent;
		var link = article.getElementsByTagName("link")[0].textContent;
		var date, description;

		switch(this.props.currentSourceName) {
			case "Straits Times":
				let dateAndDescription = article.getElementsByTagName("description")[0];
				if(dateAndDescription != null) {
					date = dateAndDescription.textContent.split("<br /><br />")[0];
					description = dateAndDescription.textContent.split("<br /><br />")[1];
				}
				break;

			case "Channel News Asia":
				date = article.getElementsByTagName("pubDate")[0].textContent;
				if(article.getElementsByTagName("description")[0] != null) {
					description = article.getElementsByTagName("description")[0].textContent;
				}
				break;

			default:
				break;
		}

		return (
			<div className="article">
				<a href={link} target="_blank">
					<h2>{title}</h2>
				</a>
				<p><small>{date}</small></p>
				<p>{description}</p>
			</div>
		);
	}

}

ReactDOM.render(<NewsFeed sources={sources}/>, document.getElementById('root'));