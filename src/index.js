import React from 'react';
import ReactDOM from 'react-dom';
import $ from 'jquery';
import './styles.css';

// Currently supports The Straits Times & Channel New Asia

// RSS feed format for the different sources //////////////////////////////////////////////////////////////////////////////////////


// Variables //////////////////////////////////////////////////////////////////////////////////////

// Format:
// sources is an array of "source"s (object literal)
// A source is an object literal which contains the properties sourceName (string) & categories (array)
// categories is an array that contains "category"s (object literal)
// A category is an object literal which contains the properties categoryName (string) & url (string) (link to the RSS feed)
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


// Components /////////////////////////////////////////////////////////////////////////////////////

// App Hierarchy
// 	- NewsFeed (stateful)
// 		- Filter (stateless)
// 			- SourceFilter (stateless)
// 			- CategoryFilter (stateless)
// 		- ArticleList (stateful)
// 			- Article (stateless)


// NewsFeed contains the whole app
class NewsFeed extends React.Component {
	// State: currentSource & currentCategory contain the source & category currently selected respectively (object literals)
	// By default its the first item which is the same default displayed by the select element
	constructor(props) {
		super(props);
		this.state = {
			currentSource: this.props.sources[0],
			currentCategory: this.props.sources[0].categories[0]
		}

		this.onChangeSource = this.onChangeSource.bind(this);
		this.onChangeCategory = this.onChangeCategory.bind(this);
	}

	// Event Handlers
	// onChangeSource & onChangeCategory are event handlers which will be passed to the select element in SourceFilter & CategoryFilter respectively
	// They take in the strings representing the source & category as that's the only information available to those components
	// These functions will search the arrays of sources & categories to find the object literal matching the string & will update the state to them
	// onChangeSource will also set the currentCategory to the first category for the newly selected source
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

	// Renders Filter & ArticleList
	// Filter's attributes: sources, currentSource, onChangeSource (to pass to SourceFilter), onChangeCategory (to pass to CategoryFilter)
	// ArticleList's attributes: url, currentSourceName (to pass to the article for it to know how to interpret the RSS feed)
	
	// Styling (refer to src/styles.css for more)
	// header & section is used to separate the header (title & Filter) from the body (ArticleList)
	// .container is used for containing the elements, so that they can be styled to be in the center with padding
	render() {
		var sources = this.props.sources;
		var url = this.state.currentCategory.url;

		return (
			<div>
				<header>
					<div className="container">
						<h1>News Feed</h1>
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

// Filter contains the select elements which act as filters (sourceFilter & categoryFilter)
class Filter extends React.Component {

	// Renders SourceFilter & CategoryFilter
	// SourceFilter's attributes: sourceNames, onChangeSource
	// CategoryFilter's attributes: categoryNames, onChangeCategory, currentSourceName (for the key for each option to distinguish between categories of the same name belonging to different sources)
	render() {
		// Generation of sourceNames & categoryNames arrays by iterating throught through the sources array
		var sources = this.props.sources;
		var sourceNames = [];
		var categoryNames = [];

		// Looking through each source
		for(let source in sources) {

			let sourceName = sources[source].sourceName;
			sourceNames.push(sourceName);

			// Loooking through each category of the currently selected source
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

// SourceFilter is used to select the source
class SourceFilter extends React.Component {
	constructor(props) {
		super(props);
		this.onChangeSource = this.onChangeSource.bind(this);
	}

	// Uses the onChangeSource function to update the state.currentSource of NewsFeed
	onChangeSource(e) {
		this.props.onChangeSource(e.target.value);
	}

	// Renders a "Source: " label & a select element with the source options
	// Changing the source option selected will activate the event onChangeSource
	// Value & text of option elements are both the sourceName
	render() {
		// Creating the option elements
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

// CategoryFilter is used to select the category
class CategoryFilter extends React.Component {
	constructor(props) {
		super(props);
		this.onChangeCategory = this.onChangeCategory.bind(this);
	}

	// Uses the onChangeCategory function to update the state.currentCategory of NewsFeed
	onChangeCategory(e) {
		this.props.onChangeCategory(e.target.value);
	}

	// Renders a "Category: " label & a select element with the category options
	// Changing the category option selected will activate the event onChangeCategory
	// Value & text of option elements are both the categoryName
	render() {
		// Creating the option elements
		var currentSourceName = this.props.currentSourceName;
		var categoryNames = this.props.categoryNames;
		var options = [];

		categoryNames.forEach(function(categoryName) {
			// Key combines source name & category name to ensure that categories belonging to different sources with the same name can be distinguished from each other
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

// ArticleList fetches the RSS feed & loads the "Article"s
class ArticleList extends React.Component {
	// State: articleItems contains an array containing the "item"s from the RSS feed
	// By default its an empty array
	constructor(props) {
		super(props);
		this.state = {
			articleItems: [],
			loading: true
		};

	}

	// Fetches the RSS feed from the RSS feed url & adds the items to this.state.articleItems
	// Currently uses https://cors-anywhere.herokuapp.com/ to avoid cors problems, but I need to figure out an alternative
	fetchDataFromUrl(url) {
		$.ajax({

			type: "GET",
			url: "https://cors-anywhere.herokuapp.com/" + url,
			dataType: "xml" ,

			success: function(data) {
				this.setState({
					articleItems: data.getElementsByTagName("item"),
					loading: false
				});
			}.bind(this),

			error: function(xhr, status, err) {
				console.error(url, status, err.toString());
			}

		});
	}

	// componentDidMount & componentWillReceiveProps both call fetchDataFromUrl to ensure that the this.state.articleItems is updated with every render
	// Since fetchDataFromUrl calls an ajax method & this.setState, it may take some time between the initial render before the "article"s are loaded
	// These methods are used as they are called before the render & allow this.setState to be called
	componentDidMount() {
		this.fetchDataFromUrl(this.props.url);
	}

	componentWillReceiveProps(nextProps) {
		if(this.props !== nextProps) { // To ensure that the props are updated to avoid excessive fetching
			this.setState({loading: true});
			this.fetchDataFromUrl(nextProps.url);

		}
	}

	// Renders either an error message if there are no articles found or an array of the "Article"s
	// Article's attributes: article, currentSourceName (for it to know how to interpret the RSS feed), key

	// Style
	// If there are articles, they are put in a div with the class .article-list
	render() {

		// Loading
		if (this.state.loading) {

			return (
				<div>
					<div className="loader"></div>
				</div>
			);
		}


		// Creating the article components
		var articleItems = this.state.articleItems;
		var articles = [];

		for(let i = 0; i < articleItems.length; i++) {

			var article = articleItems[i];
			var title = article.children[0].textContent;
			articles.push(<Article article={article} currentSourceName={this.props.currentSourceName} key={title}/>)

		}

		if (articles.length === 0) {

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

// Article displays each article item in the RSS feed
class Article extends React.Component {

	// Convert to an array of links & text
	escapeLinks(description) {

		// <a href=";
		var aStartPos = description.search("<a"); // Next
		var descriptionArr = [];
		var key = 0;

		// Contains links
		if (aStartPos !== -1) {

			while (aStartPos !== -1) {

				// Add text segment if any
				var textSeg = description.substring(0, aStartPos);
				if(aStartPos !== 0) descriptionArr.push(textSeg);

				// Establishing Positions
				var targetPos = description.search("target");
				var aEndPos = description.search("</a>");

				// Adding the a tag
				// e.g. <a href="https://www.straitstimes.com/singapore/health/ip-insurers-losses-raise-possibility-of-premium-hikes" target="_blank">IP insurers' losses raise </a>
				var link, text;

				if (targetPos !== -1 && targetPos < aEndPos) { // Contains target

					link = description.substring(aStartPos + 9, targetPos - 2);
					text = description.substring(targetPos + 16, aEndPos);

				} else { // Doesn;t contain target

					var aStartBracketPos = description.search(">");

					link = description.substring(aStartPos + 9, aStartBracketPos - 1);
					text = description.substring(aStartBracketPos + 1, aEndPos);
				}
				
				descriptionArr.push(<a href={link} target="_blank" key={key}>{text}</a>);

				// Trim a tag
				description = description.substring(aEndPos + 4);

				// Update counters
				aStartPos = description.search("<a");
				key++;
			}

			// Add text segment if any
			if(description !== "") descriptionArr.push(description);
			return descriptionArr;

		// No links
		} else {

			descriptionArr.push(description);
			return descriptionArr;
		}

	}

	// Renders a title (linked), date & description
	render() {
		var article = this.props.article;
		var title = article.getElementsByTagName("title")[0].textContent;
		var link = article.getElementsByTagName("link")[0].textContent;
		var date, description, descriptionArr;

		// Handling the different RSS feed formatting
		switch(this.props.currentSourceName) {

			case "Straits Times":
				let dateAndDescription = article.getElementsByTagName("description")[0];
				if(dateAndDescription != null) {

					date = dateAndDescription.textContent.split("<br /><br />")[0];
					description = dateAndDescription.textContent.split("<br /><br />")[1];
					descriptionArr = this.escapeLinks(description);
				}
				break;

			case "Channel News Asia":
				date = article.getElementsByTagName("pubDate")[0].textContent;
				if(article.getElementsByTagName("description")[0] != null) {

					description = article.getElementsByTagName("description")[0].textContent;
					descriptionArr = this.escapeLinks(description);
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
				<p>{descriptionArr}</p>
			</div>
		);
	}
}


// ReactDOM render ////////////////////////////////////////////////////////////////////////////////

ReactDOM.render(<NewsFeed sources={sources}/>, document.getElementById('root'));