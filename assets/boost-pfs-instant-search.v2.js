/** VERSION: 1.0.0 Please do not delete this line. Thank you! **/
// Override Settings
var boostPFSInstantSearchConfig = {
	search: {
		//suggestionMode: 'test',
		//suggestionPosition: 'left'
      suggestionMobileStyle: 'style2'
	}
};

(function() {
	BoostPFS.inject(this);

	// Customize style of Suggestion box
	SearchInput.prototype.customizeInstantSearch = function() {
		var suggestionElement = this.$uiMenuElement;
		var searchElement = this.$element;
		var searchBoxId = this.id;
	};

  // Bind Event for input search Mobile
  var bindEventsMobile = InstantSearchMobile.prototype.bindEvents;
  InstantSearchMobile.prototype.bindEvents = function() {
    bindEventsMobile.call(this);

    var self = this;
    var searchButtonMobile = '.site-nav--mobile .search-button, .js-search-destop';
    var searchInputMobile = '.search-input-group input[type="search"], .wg-search-form .search-input';
    var searchCloseButtonMobile = '.drawer__close > button, .drawer_back a';
    jQ(searchButtonMobile).off('click').click(function(e) {
      e.preventDefault();
      //e.stopPropagation();
      jQ(searchInputMobile).focus();
      self.openSuggestionMobile();
      jQ(searchCloseButtonMobile).trigger('click');

    });
  }
  
  // Bind Event for input search style 3
  var bindEvents = InstantSearchStyle3.prototype.bindEvents;
  InstantSearchStyle3.prototype.bindEvents = function() {
    bindEvents.call(this);

    var self = this;
    var searchButtonDesktop = '.site-header__links .search-button';
    var searchInputDesktop = '#SearchContainer #search-input';
    var searchCloseButtonDesktop = '.drawer__close > button';
    jQ(searchButtonDesktop).off('click').click(function(e) {
      e.preventDefault();
      //e.stopPropagation();
      jQ(searchInputDesktop).focus();
      self.openSuggestionStyle3();
      jQ(searchCloseButtonDesktop).trigger('click');

    });
  }

  // Fix search for the Flow theme
  jQ('.site-header__links .search-button').on('click', function() {
    setTimeout(function() {
      boostPFS.initSearchBox();
      if(Utils.isCollectionPage()) jQ('.search-input-group > .boost-pfs-search-box').val('');
    }, 500);
  });
  
  InstantSearchResultItemProduct.prototype.getTemplate = function(tempType) {
		switch (tempType) {
			case InstantSearchResultItemProduct.tempType.IMAGE:
				return `
					<div class="{{class.searchSuggestion}}-left">
						<img tabindex="-1" src="{{imageUrl}}" alt="{{escapedTitle}}">
					</div>
				`.trim();
			case InstantSearchResultItemProduct.tempType.SKU:
				return `
					<p class="{{class.searchSuggestion}}-product-sku">SKU: {{sku}}</p>
				`.trim();
			case InstantSearchResultItemProduct.tempType.VENDOR:
				return `
					<p class="{{class.searchSuggestion}}-product-vendor">{{vendor}}</p>
				`.trim();
			case InstantSearchResultItemProduct.tempType.PRICE:
				return `
					<p class="{{class.searchSuggestion}}-product-price">
						<span class="{{class.searchSuggestion}}-product-regular-price">{{regularPrice}}</span>
					</p>
					<p class="{{class.searchSuggestion}}-product-price">
						<span class="{{class.searchSuggestion}}-product-regular-price">{{priceMin}}</span>
						<span> {{dot}} </span>
						<span class="{{class.searchSuggestion}}-product-regular-price">{{priceMax}}</span>
					</p>
				`.trim();
			case InstantSearchResultItemProduct.tempType.PRICE_SALE:
				return `
					<p class="{{class.searchSuggestion}}-product-price">
						<s>{{compareAtPrice}}</s>&nbsp;
						<span class="{{class.searchSuggestion}}-product-sale-price">{{regularPrice}}</span>
					</p>
				`.trim();
			default:
				return `
					<li class="{{class.searchSuggestionItem}} {{class.searchSuggestionItem}}-product {{class.searchUiAutocompleteItem}}" aria-label="{{escapedBlockType}}: {{escapedTitle}}" data-id="{{id}}" role="option">
						<a tabindex="-1" href="{{url}}" {{newTabAttribute}}>
							{{itemProductImage}}
							<div class="{{class.searchSuggestion}}-right">
								<p class="{{class.searchSuggestion}}-product-title">{{title}}</p>
								{{itemProductSku}}
								{{itemProductVendor}}
								{{itemProductPrice}}
							</div>
						</a>
					</li>
				`.trim();
		}
	}
  
  InstantSearchResultItemProduct.prototype.compileSuggestionProductPrice = function() {
    	let isTwoPrice = this.data.price_min && this.data.price_max && this.data.price_min !== this.data.price_max ? true : false;
		let priceMin = '';
        let priceMax = '';	
    	let dot = '';
		// If the multi-currency feature is enabled, update the product price
		this.prepareSuggestionProductPriceData();
		// Check on sale
		var onSale = this.data.compare_at_price_min > this.data.price_min;
		// Format price
		var price = Utils.formatMoney(this.data.price_min);
		var compareAtPrice = '';
		if (this.data && this.data.compare_at_price_min) {
			compareAtPrice = Utils.formatMoney(this.data.compare_at_price_min);
			if (Settings.getSettingValue('search.removePriceDecimal')) {
				price = Utils.removeDecimal(price);
				compareAtPrice = Utils.removeDecimal(compareAtPrice);
			}
		}
		
		// Build Price
		var result = '';
		if (Settings.getSettingValue('search.showSuggestionProductPrice')) {

			 if (isTwoPrice || !onSale ) {
				result = this.getTemplate(InstantSearchResultItemProduct.tempType.PRICE);
			} else if (onSale && Settings.getSettingValue('search.showSuggestionProductSalePrice')) {
				result = this.getTemplate(InstantSearchResultItemProduct.tempType.PRICE_SALE);
			}
		}
    
    	// Build Price Min - Max
        if(isTwoPrice) {
				priceMin = Utils.formatMoney(this.data.price_min);
                priceMax = Utils.formatMoney(this.data.price_max);
          		price = '';
          		dot = ' - ';
        }
		return result
        	.replace(/{{dot}}/g, dot)
        	.replace(/{{priceMin}}/g, priceMin)
			.replace(/{{priceMax}}/g, priceMax)
			.replace(/{{regularPrice}}/g, price)
			.replace(/{{compareAtPrice}}/g, compareAtPrice);
	}

})();