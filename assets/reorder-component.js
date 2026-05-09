/**
 * Re orders component
 * 
 * @module reorders
 * @version 1.0.0
 * @extends HTMLElement
 */
 class reordersComponent extends HTMLElement {

    /**
     * Re orders web component.
     * 
     * @constructor
     */
    constructor() {

        super();

        this.initEvents();
    }

    /**
     * Init Re orders events.
     * 
     * @returns {undefined}
     */
     initEvents() {

        this.querySelectorAll('[data-reorder-btn]').forEach(btn => {
            btn.addEventListener('click', (event) => {
                this.getProductData(btn);
            });
        });

    }

    /**
     * add Product for the order on Cart
     * 
     * @param {string} index index value.
     * @param {object} data a data of product.
     * @param {object} btn a btn object.
     * 
     * @returns {undefined}
     */
     addProductOnCart(index, data, btn) {

        if(data[index].check_inventory){
            data[index].quantity = Math.min(parseInt(data[index].inventory), parseInt(data[index].quantity));
        }
      
        let request = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json;'
            },
            body: JSON.stringify({
                id: data[index].id,
                quantity: data[index].quantity
            })
        };
      
        fetch('/cart/add.js', request).then(function(response) {

        return response.json();

        }).then(function(res) {
        
            if(index >= data.length - 1){
                btn.classList.remove("loading");
                window.location.href = '/cart';
                return;
            }else{
                this.addProductOnCart(index+1, data);
            }
            
        });
    }

     /**
     * get Product data
     * 
     * @param {object} btn a btn object.
     * 
     * @returns {undefined}
     */
    
    getProductData(btn){

        let ids = this.getAttribute('data-variant-ids').split(',');
        let quantities = this.getAttribute('data-variant-quantities').split(',');
        let inventories = this.getAttribute('data-variant-inventories').split(',');
        let inventory_policies = this.getAttribute('data-variant-inventory-policies').split(',');
        let inventory_trackers = this.getAttribute('data-variant-inventory-trackers').split(',');
        
        ids.splice(-1, 1);
        quantities.splice(-1, 1);
        inventories.splice(-1, 1);
        inventory_policies.splice(-1, 1);
        inventory_trackers.splice(-1, 1);
        
        let data = [];
        for(let i=0; i<ids.length; i++){
            data.push({
                id: ids[i],
                quantity: quantities[i],
                inventory: inventories[i],
                check_inventory: (inventory_policies[i] == "deny" && inventory_trackers[i] != "")
            });
        }

        btn.classList.add("loading");
        this.addProductOnCart(0, data, btn);
    }

}

customElements.define('reorder-component', reordersComponent);
