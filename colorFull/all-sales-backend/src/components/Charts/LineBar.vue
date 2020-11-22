<template>
  <div>
    <v-chart :force-fit="true" :height="height" :data="sourceData" :scale="scale">
      <v-tooltip />
      <v-axis />
      <v-legend/>
      <v-line position="datetime*数量" color="时间" shape="smooth"/>
      <!-- <v-point position="datetime*数量" color="时间" :size="4" :v-style="style" :shape="'circle'" /> -->
    </v-chart>
  </div>
</template>
<script>
const DataSet = require('@antv/data-set')

export default {
  name: 'LineBar',
  props: {
    data: {
      type: Array,
      default: () => {
        return []
      }
    },
    fields: {
      type: Array,
      default: () => {
        return ['浏览次数', '浏览人数', '转发次数', '转发人数']
      }
    }
  },
  watch: {
    data () {
      this.loadData()
    }
  },
  data () {
    return {
      sourceData: [],
      scale: [{
        dataKey: 'datetime',
        type: 'timeCat',
        tickInterval: 2,
        mask: 'YYYY-MM-DD HH'
      }],
      height: 400,
      style: { stroke: '#fff', lineWidth: 1 }
    }
  },
  mounted () {
    this.loadData()
  },
  methods: {
    loadData () {
      const dv = new DataSet.View().source(this.data)
      dv.transform({
        type: 'fold',
        fields: this.fields,
        key: '时间',
        value: '数量'
      })
      this.sourceData = dv.rows
    }
  }
}
</script>
