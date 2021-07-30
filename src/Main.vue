<template>
    <div>
        <div id="tvjs-header">
            <h1><img src="./assets/logo.png"/>
                <label>回测结果</label>
            </h1>
            <multimenu v-tooltip.left="'OK'" :list="ext_names" @onStockSel="StockSel"/>
            
            <!-- <multiselect v-tooltip.bottom="'OK'" :list="ext_names" @onstate="reset"/> -->
            <span class="night-mode">
                <input type="checkbox" v-model="night">
                <label>切换背景</label>
            </span>
        </div>
        <div id="app-conainer" :style="{top: top+'px'}">
            <component v-bind:is="current_app"
                :night="night" :resetkey="resetkey"
                :stock_id="stockid"
                :pdata="chart"
                :ext="extensions">
            </component>
        </div>
        <!-- <div class="app-tags">
            <app-tag v-for="app of apps" :id="app.id"
                :sel="current === app.id" :key="app.id"
                @select="onselect"/>
        </div> -->
    </div>
</template>

<script>
import TradingVue from 'trading-vue-js'
import { DataCube } from 'trading-vue-js'
import StdInput from './components/StdInput.vue'
import Multiselect from './components/Multiselect.vue'
import Multimenu from './components/Multimenu.vue'
import AppTag from './components/AppTag.vue'
import Data from '../data/data.json'
import Extensions from './index_dev'

import App1 from './apps/App1.vue'
import App2 from './apps/App2.vue'

export default {
    name: 'app',
    msg:  "okkkkkkk",
    components: {
        TradingVue, StdInput, Multiselect, Multimenu, AppTag
    },
    methods: {
        onResize() {
            this.width = window.innerWidth
            this.height = window.innerHeight - this.top
        },
        win_query() {
            let qs = (function(a) {
                if (a == "") return {};
                var b = {};
                for (var i = 0; i < a.length; ++i) {
                    var p=a[i].split('=', 2);
                    if (p.length == 1)
                        b[p[0]] = "";
                    else
                        b[p[0]] = decodeURIComponent(p[1].replace(/\+/g, " "));
                }
                return b;
            })(window.location.search.substr(1).split('&'));
            return qs
        },
        reset(state) {
            let sub = Object.keys(state).filter(x => state[x])
            this.extensions = sub.map(x => Extensions[x])
            this.resetkey++
        },
        onselect(id) {
            this.current = id
        },
        StockSel(index) {
            console.log("stocksel", index)
            this.chart = new DataCube(parent.window['tvjs_data'][index]);
            
            console.log("sele", this)
            this.resetkey++ //trigger vue component recreate
        },
        getMenuItem() {
            if ( ! ('tvjs_data' in parent.window) )
                //chartdata = new DataCube(Data);
                return []
            else {
                var menuitem = ["上证指数"]
                console.log("menu", parent.window['tvjs_data'])
                for ( var i =1; i < Object.keys(parent.window['tvjs_data']).length; i++) {
                    menuitem.push(parent.window['tvjs_data'][i]["figtitle"])
                    console.log("mi", parent.window['tvjs_data'][i]["figtitle"])
                }
                return menuitem
            }
        }
    },
    mounted() {
        window.addEventListener('resize', this.onResize)
        let q = this.win_query()
        if (q.nm === 'false') this.night = false
        if (q.ov) this.current = q.ov
        if (q.header === 'false') this.top = 0
        this.onResize()
    },
    beforeDestroy() {
        window.removeEventListener('resize', this.onResize)
    },
    created() {
        window.addEventListener('setItem0', ()=> {
            this.chart = new DataCube(parent.window['tvjs_data'][0]);
            this.ext_names = this.getMenuItem()
            
            console.log("last", this)
            /*
            for( var ex of this.ext ) { //in add_overlay -> update_ids, the data is old, but the bug havn't been fixed
                if ( ex.Main.__name__ == "legend-buttons" ) { //update data in extension
                    console.log("update_tvdcsett", this.dc, this.$refs.tvjs.data, this.$refs.tvjs.xSettings, ex)
                    ex.Main.prototype.update_tvdcsett(this.$refs.tvjs, this.dc, this.$refs.tvjs.xSettings[ex.Main.__name__])
                }
            }*/
            this.resetkey++ //trigger vue component recreate
            //this.$refs.tvjs.setRange(0, last)
        })
        //console.log("range", this.$refs.tvjs, this.$refs.tvjs.getRange())
    },
    data() {
        var chartdata;
        if ( ! ('tvjs_data' in parent.window) )
            //chartdata = new DataCube(Data);
            chartdata = new DataCube(Data)
        else {
            chartdata = new DataCube(parent.window['tvjs_data'][0]);
        }
        console.log("data")
        return {
            chart: chartdata, // Data will be here,
            //chart: new DataCube({}), // Data will be here,
            indexBased: true,
            width: window.innerWidth,
            height: window.innerHeight,
            extensions: Object.values(Extensions),
            ext_names: this.getMenuItem(), //Object.keys(Extensions),
            night: true,
            current: 'app-1',
            top: 50,
            resetkey: 0,
            stockid: 0,
            apps: [
                { id: 'app-1', comp: App1 },
                { id: 'app-2', comp: App2 },
            ]
        }
    },
    computed: {
        current_app() {
            return App1
            /*
            return this.apps.find(
                x => x.id === this.current).comp
            */
        }
    }
}
</script>

<style>
html,
body {
    background-color: #000;
    margin: 0;
    padding: 0;
    overflow: hidden;
    font: 11px -apple-system,BlinkMacSystemFont,
        Segoe UI,Roboto,Oxygen,Ubuntu,Cantarell,
        Fira Sans,Droid Sans,Helvetica Neue,
        sans-serif
}
#tvjs-header {
    position: absolute;
    height: 49px;
    color: #ddd;
    width: 100%;
    background-color: #121826;
    border-bottom: 1px solid black;
}
#tvjs-header img{
    width: 40px;
    height: 40px;
    margin: 5px;
}

#tvjs-header label{
    vertical-align: top;
    line-height: 2.3em;
    margin-left: 2px;
    font-weight: 500;
}

#app-conainer {
    position: absolute;
    width: 100%;
}
#tvjs-header h1 {
    color: #9b9ca0;
    margin: 0px 0 0 3px;
}
#tvjs-header p {
    position: absolute;
    width: 100%;
    top: 1px;
    text-align: center;
    font-family: -apple-system,BlinkMacSystemFont,
    Segoe UI,Roboto,Oxygen,Ubuntu,Cantarell,
    Fira Sans,Droid Sans,Helvetica Neue,
    sans-serif;
    font-weight: 200;
}
#extensions-lbl {
    position: absolute;
    top: 17px;
    color: #5e6061;
    right: 290px;
    font-weight: 600;
}
.night-mode {
    position: absolute;
    top: 15px;
    right: 20px;
}
.app-tags {
    position: absolute;
    top: 65px;
    right: 75px;
}

.tooltip {
  display: block !important;
  z-index: 10000;
}

.tooltip .tooltip-inner {
  background: black;
  color: white;
  border-radius: 16px;
  padding: 5px 10px 4px;
}

.tooltip .tooltip-arrow {
  width: 0;
  height: 0;
  border-style: solid;
  position: absolute;
  margin: 5px;
  border-color: black;
  z-index: 1;
}

.tooltip[x-placement^="top"] {
  margin-bottom: 5px;
}

.tooltip[x-placement^="top"] .tooltip-arrow {
  border-width: 5px 5px 0 5px;
  border-left-color: transparent !important;
  border-right-color: transparent !important;
  border-bottom-color: transparent !important;
  bottom: -5px;
  left: calc(50% - 5px);
  margin-top: 0;
  margin-bottom: 0;
}

.tooltip[x-placement^="bottom"] {
  margin-top: 5px;
}

.tooltip[x-placement^="bottom"] .tooltip-arrow {
  border-width: 0 5px 5px 5px;
  border-left-color: transparent !important;
  border-right-color: transparent !important;
  border-top-color: transparent !important;
  top: -5px;
  left: calc(50% - 5px);
  margin-top: 0;
  margin-bottom: 0;
}

.tooltip[x-placement^="right"] {
  margin-left: 5px;
}

.tooltip[x-placement^="right"] .tooltip-arrow {
  border-width: 5px 5px 5px 0;
  border-left-color: transparent !important;
  border-top-color: transparent !important;
  border-bottom-color: transparent !important;
  left: -5px;
  top: calc(50% - 5px);
  margin-left: 0;
  margin-right: 0;
}

.tooltip[x-placement^="left"] {
  margin-right: 5px;
}

.tooltip[x-placement^="left"] .tooltip-arrow {
  border-width: 5px 0 5px 5px;
  border-top-color: transparent !important;
  border-right-color: transparent !important;
  border-bottom-color: transparent !important;
  right: -5px;
  top: calc(50% - 5px);
  margin-left: 0;
  margin-right: 0;
}

.tooltip.popover .popover-inner {
  background: #f9f9f9;
  color: black;
  padding: 24px;
  border-radius: 5px;
  box-shadow: 0 5px 30px rgba(black, .1);
}

.tooltip.popover .popover-arrow {
  border-color: #f9f9f9;
}

.tooltip[aria-hidden='true'] {
  visibility: hidden;
  opacity: 0;
  transition: opacity .15s, visibility .15s;
}

.tooltip[aria-hidden='false'] {
  visibility: visible;
  opacity: 1;
  transition: opacity .15s;
}

</style>
