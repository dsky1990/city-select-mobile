/**
 * citySelectMobile.js
 * Created by dsky on 16/8/11.
 */

(function () {
  var citySelcetTpl = '<div class="city-selector hide"><div class="mask"></div><div class="show-dialog">'+
      '<div class="sd-hd"><span class="rl-back hide"></span><span class="rl-left sd-cancel">取消</span><h2 class="sd-tit" id="js-area">选择省</h2></div>'+
      '<div class="sd-bd"><ul class="area-list"></ul></div></div></div>';
  $('body').append(citySelcetTpl);
  var areaDate = null,
      getStatus = false;
  if(!getStatus){
    $.get("area.json", function(data){
      areaDate = data;
      getStatus = true;
    });
  }
  $(".citySelectorMobile").off('focus').on("focus", function () {
    $(".city-selector").removeClass("hide");
    var $ele = $(this);
    citySelect.init(areaDate, $ele);
  });
  $('.sd-cancel').on('click', function () {
    $(".city-selector").addClass("hide");
  });

  var citySelect = (function () {
    return{
      $regionUl: null,
      $bar: null,
      provinceText: '',
      cityText: '',
      areaText: '',
      provinceId: null,
      cityId: null,
      areaId: null,
      init: function (data, $ele) {
        var _this = this,
            provinceLen = data.length,
            provinceStr = '';
        _this.provinceId = null;
        _this.scrollTop();
        for(var i=0; i< provinceLen; i++){
          var $li = '<li class="province-list" data-province="'+ i +'">'+ data[i].name +'</li>';
          provinceStr += $li;
        }
        _this.$bar = $('.city-selector .sd-tit');
        _this.$regionUl = $('.city-selector .area-list').html(provinceStr);
        _this.$bar.text('选择省');
        _this.setProvince(data, $ele);
      },
      scrollTop: function () {
        $('.city-selector .sd-bd').animate({scrollTop:0},'fast');
      },
      setProvince: function (data, $ele) {
        var _this = this;
        _this.provinceId = null;
        _this.$regionUl.find('.province-list').off('click').on('click', function (e) {
          e.preventDefault();
          e.stopPropagation();
          var $this = $(this);
          _this.provinceId = $this.data('province');
          _this.provinceText = $this.text();
          _this.$bar.text(_this.provinceText);
          _this.setCity(data, $ele);
        });
      },
      setCity: function (data, $ele) {
        var _this = this,
            provinceId = _this.provinceId,
            cityStr = '';
        var cityLen = data[provinceId].citys.length;
        _this.$regionUl.html('');
        _this.scrollTop();
        for(var i=0; i< cityLen; i++){
          var $li = '<li class="city-list" data-city="'+ i +'">'+ data[provinceId].citys[i].name +'</li>';
          cityStr += $li;
        }
        _this.$regionUl.html(cityStr);
        _this.getArea(data, $ele);
      },
      getArea: function (data, $ele) {
        var _this = this;
        _this.cityId = null;
        _this.$regionUl.find('.city-list').off('click').on('click', function (e) {
          e.preventDefault();
          e.stopPropagation();
          var $this = $(this);
          _this.cityId = $this.data('city');
          _this.cityText = $this.text();
          _this.$bar.text(_this.provinceText+'-'+_this.cityText);
          _this.setArea(data, $ele);
        });
      },
      setArea: function (data, $ele) {
        var _this = this;
        var provinceId = _this.provinceId;
        var cityId = _this.cityId;
        var areaLen = data[provinceId].citys[cityId].county.length;
        var areaStr = '';
        _this.$regionUl.html('');
        _this.scrollTop();
        for(var i=0; i< areaLen; i++){
          var $li = '<li class="city-region area-list" data-area="'+ i +'" data-id="'+ data[provinceId].citys[cityId].county[i].id +'">'+ data[provinceId].citys[cityId].county[i].name +'</li>';
          areaStr += $li;
        }
        _this.$regionUl.html(areaStr);
        _this.setValue($ele);
      },
      setValue:function ($ele) {
        var linkStr = '-',
            _this = this;
        _this.$regionUl.find('.area-list').off('click').on('click', function (e) {
          e.preventDefault();
          e.stopPropagation();
          var areaText = $(this).text();
          var result = _this.provinceText + linkStr + _this.cityText + linkStr + areaText;
          $(".city-selector").addClass("hide");
          $ele.val(result);
        });
      }
    }
  }());
}());