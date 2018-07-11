<template>
  <div class='settings'>
    <div class='form-group'>
      <label class='label' for='hosting'>使用图床</label>
      <div class='select'>
        <select name='hosting' id='hosting' v-model='config.use'>
          <option value='sm.ms'>sm.ms</option>
          <option value='weibo'>weibo</option>
        </select>
        <div class='select__arrow'></div>
      </div>
    </div>
    <div class='form-group'>
      <label class='label'>复制成功时</label>
      <label class='control control--radio'>弹出提示
        <input type="radio" name='poptip' value='alert' v-model='config.mode'>
        <div class="control__indicator"></div>  
      </label>
      <label class='control control--radio'>静默无声
        <input type="radio" name='poptip' value='silent' v-model='config.mode'>
        <div class="control__indicator"></div>
      </label>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    config: {
      type: Object,
      required: true
    }
  },
  watch: {
    config: {
      deep: true,
      handler () {
        this.$emit('on-change', this.config)
      }
    }
  }
}
</script>

<style lang='less' scoped>
.settings {
  padding: 20px;
  font-size: 14px;
}
.form-group {
  margin-bottom: 15px;
  .label {
    display: block;
    font-weight: 700;
    margin-bottom: 10px;
  }
}

.control {
  display: block;
  position: relative;
  padding-left: 20px;
  margin-bottom: 15px;
  cursor: pointer;
  font-size: 12px;
}
.control input {
  position: absolute;
  z-index: -1;
  opacity: 0;
}
.control__indicator {
  position: absolute;
  top: 2px;
  left: 0;
  height: 15px;
  width: 15px;
  background: #e6e6e6;
}
.control--radio .control__indicator {
  border-radius: 50%;
}
.control:hover input ~ .control__indicator,
.control input:focus ~ .control__indicator {
  background: #eee;
}
.control input:checked ~ .control__indicator {
  background: #1296db;
}
.control:hover input:not([disabled]):checked ~ .control__indicator,
.control input:checked:focus ~ .control__indicator {
  background: #1085c4;
}
.control input:disabled ~ .control__indicator {
  background: #e6e6e6;
  opacity: 0.6;
  pointer-events: none;
}


.control__indicator:after {
  content: '';
  position: absolute;
  display: none;
}
.control input:checked ~ .control__indicator:after {
  display: block;
}


.control--radio .control__indicator:after {
  left: 5px;
  top: 5px;
  height: 5px;
  width: 5px;
  border-radius: 50%;
  background: #fff;
}
.select {
  position: relative;
  display: inline-block;
  margin-bottom: 15px;
  min-width: 120px;
}
.select select {
  display: inline-block;
  cursor: pointer;
  min-width: 120px;
  padding: 6px 10px;
  outline: 0;
  border: 0;
  border-radius: 0;
  background: #efefef;
  color: #7b7b7b;
  appearance: none;
  -webkit-appearance: none;
  -moz-appearance: none;
}
.select select::-ms-expand {
  display: none;
}
.select select:hover,
.select select:focus {
  color: #444;
  background: #eee;
}
.select select:disabled {
  opacity: 0.5;
  pointer-events: none;
}
.select__arrow {
  position: absolute;
  top: 10px;
  right: 10px;
  width: 0;
  height: 0;
  pointer-events: none;
  border-style: solid;
  border-width: 8px 5px 0 5px;
  border-color: #7b7b7b transparent transparent transparent;
}
.select select:hover ~ .select__arrow,
.select select:focus ~ .select__arrow {
  border-top-color: #000;
}
.select select:disabled ~ .select__arrow {
  border-top-color: #ccc;
}
</style>
