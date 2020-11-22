<template>
  <div :style="{ padding: '0 0 32px 32px' }">
    <h4 :style="{ marginBottom: '20px' }">{{ title }}</h4>
    <v-chart
      height="254"
      :data="data"
      :forceFit="true"
      :padding="['auto', 'auto', '40', '50']">
      <v-tooltip />
      <v-axis />
      <v-legend/>
      <v-bar position="月份*月均降雨量" :adjust="adjust"/>
    </v-chart>
  </div>
</template>

<script>
export default {
  name: 'Bar',
  props: {
    title: {
      type: String,
      default: ''
    },
    data: {
      type: Array,
      default: () => {
        return []
      }
    },
    scale: {
      type: Array,
      default: () => {
        return [{
          dataKey: 'x',
          min: 2
        }, {
          dataKey: 'y',
          title: '时间',
          min: 1,
          max: 22
        }]
      }
    },
    tooltip: {
      type: Array,
      default: () => {
        return [
          'x*y',
          (x, y) => ({
            name: x,
            value: y
          })
        ]
      }
    },
    adjust: {
      type: Array,
      default: () => {
        return [{
          type: 'dodge',
          marginRatio: 1 / 32
        }]
      }
    }
  },
  data () {
    return {

    }
  }
}
</script>
