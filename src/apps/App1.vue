<template>
    <trading-vue :data="dc" :width="this.width" :height="this.height"
        :title-txt="title_stock" :key="resetkey"
        ref="tvjs"
        :legend-buttons="['display', 'settings', 'up', 'down', 'add', 'remove']"
        :chart-config="{DEFAULT_LEN:70}"
        :color-back="colors.colorBack"
        :color-grid="colors.colorGrid"
        :color-text="colors.colorText"
        :extensions="ext"
        :overlays="ovs"
        :x-settings="xsett"
        :indexBased="indexBased"
    />
</template>
<script>

import TradingVue from 'trading-vue-js'
import { DataCube } from 'trading-vue-js'
import Overlays from 'tvjs-overlays'
import Data from '../../data/data.json'

export default {
    name: 'App1',
    props: ['night', 'ext', 'stock_id', 'pdata', 'resetkey'],
    components: {
        TradingVue
    },
    watch: { 
        pdata: function(newVal, oldVal) { // watch it
            console.log('Prop changed: ', newVal, oldVal)
            this.dc = this.pdata
        },
        stock_id: function(newVal, oldVal) { // watch it
            console.log('Prop changed: ', newVal, oldVal)
            this.title_stock = this.stock_id
        }
    },
    methods: {
        onResize(event) {
            this.width = window.innerWidth
            this.height = window.innerHeight - 50
        }
    },
    created() {
        window.addEventListener('setItem1', ()=> {
            var tvjs = parent.window['tvjs'];
            var tvjs_data = [];
            tvjs_data["ohlcv"] = tvjs[0]["stock"];
            //this.dc = new DataCube(tvjs_data);
            this.dc = new DataCube(parent.window['tvjs_data'][1]);
            
            var last = parent.window["tvjs_data"][1]["chart"]["data"].length
            console.log("range", this.$refs.tvjs.getRange())
            console.log("last", last)
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
    mounted() {
        window.addEventListener('resize', this.onResize)
        this.onResize()
        window.dc = this.dc
        window.tv = this.$refs.tvjs

        /*console.log("mounted")

        if ("tvjs_data" in parent.window) {
            var last = parent.window["tvjs_data"][0]["chart"]["data"].length
            console.log("range", this.$refs.tvjs.getRange())
            console.log("last", last)
            this.$nextTick(() =>
                this.$refs.tvjs.setRange(0, last))
        }*/
    },
    computed: {
        colors() {
            return this.$props.night ? {} : {
                colorBack: '#fff',
                colorGrid: '#eee',
                colorText: '#333'
            }
        },
    },
    beforeDestroy() {
        window.removeEventListener('resize', this.onResize)
    },
    data() {
        var chartdata;
        if ( ! ('tvjs_data' in parent.window) || true )
            //chartdata = new DataCube(Data);
            chartdata = this.pdata
        else {
            var tvjs = parent.window['tvjs'];
            var tvjs_data = [];
            tvjs_data["ohlcv"] = tvjs[0]["stock"];
            chartdata = new DataCube(parent.window['tvjs_data'][1]);
        }
        return {
            //dc: new DataCube(Data),
            title_stock: this.stock_id, //"上证指数",
            dc: chartdata,
            indexBased: true,
            width: window.innerWidth,
            height: window.innerHeight,
            xsett: {
                'grid-resize': { min_height: 30 }
            },
            ovs: Object.values(Overlays)
        }
    }
}
</script>
<style>

</style>
