chrome.extension.onMessage.addListener(
    function (request, sender, sendResponse) {
        if (request.action === "copy") {
            //if(/^(https:\/\/sellercentral.amazon.com\/orders-v3\/order\/)(\d{3}-\d{7}-\d{7})$/.test(location.href) == false) {
            if (!location.href.startsWith('https://sellercentral.amazon.com/orders-v3/order/')) {
              alert("错误：只能复制亚马逊订单！")
              return
            }

            jsonData = {}
            ctrlAddress = $("div[data-test-id='shipping-section-buyer-address']").children()
            if (ctrlAddress.length  == 5) {
              jsonData['name'] = ctrlAddress.eq(0).text().trim()
              jsonData['street1'] = ctrlAddress.eq(1).text().trim()
              jsonData['city'] = ctrlAddress.eq(2).text().replace(',', '').trim()
              jsonData['state'] = ctrlAddress.eq(3).text().trim()
              jsonData['zip'] = ctrlAddress.eq(4).text().trim().split('-')[0]
            } else if (ctrlAddress.length  == 6) {
              jsonData['name'] = ctrlAddress.eq(0).text().trim()
              jsonData['street1'] = ctrlAddress.eq(1).text().trim()
              jsonData['street2'] = ctrlAddress.eq(2).text().trim()
              jsonData['city'] = ctrlAddress.eq(3).text().replace(',', '').trim()
              jsonData['state'] = ctrlAddress.eq(4).text().trim()
              jsonData['zip'] = ctrlAddress.eq(5).text().trim().split('-')[0]
            } else {
              alert("错误：复制亚马逊订单失败！")
              return
            }

            if (jsonData['state'].length == 2) {
              state = jsonData['state'].toUpperCase()
              if (state in jsonStates)
                jsonData['state'] = jsonStates[state]
              else {
                alert("错误：州[" + jsonData['state'] + "]不存在！")
                return
              }
            }

            ctrlPhone = $("span[data-test-id='shipping-section-phone']")
            if (ctrlPhone.length > 0)
              jsonData['phone'] = ctrlPhone.text().trim().replace('+1 ', '').replaceAll('-', '').replace(' ext. ', '')
            else
              jsonData['phone'] = '6265220157'

            //确保商品类型和数量都是1
            ctrlTr = $(".a-keyvalue tbody tr")
            if (ctrlTr.length > 0) {
              if (ctrlTr.eq(0).children().eq(4).text() == 1) {
                tdtext = ctrlTr.eq(0).children().eq(2).text()
                pos = tdtext.lastIndexOf('SKU:  ') + 6
                jsonData['sku'] = tdtext.substring(pos)
              }
            }
            //发送订单数据
            if (sendResponse) {
              sendResponse(JSON.stringify(jsonData));
              setTimeout(function () {
                alert("复制成功！")
              }, 100);
            }
        } else if (request.action === "paste") {
            if('https://www.postpony.com/CreateUPSLabel' != location.href) {
              alert("错误：只能粘贴到小马UPS！")
              return
            }

            jsonData = JSON.parse(request.data)
            $("#Name").val(jsonData['name'])[0].dispatchEvent(new Event('input'))
            $("#Address1").val(jsonData['street1'])[0].dispatchEvent(new Event('input'))
            if ('steet2' in jsonData)
              $("#Address2").val(jsonData['street2'])[0].dispatchEvent(new Event('input'))
            $("#City").val(jsonData['city'])[0].dispatchEvent(new Event('input'))
            $("#StateName").val(jsonData['state'])[0].dispatchEvent(new Event('input'))
            $("#ZipCode").val(jsonData['zip'])[0].dispatchEvent(new Event('input'))
            $("#Phone").val(jsonData['phone'])[0].dispatchEvent(new Event('input'))
            if ('sku' in jsonData) {
              //估算箱子重量和尺寸
              sku = jsonData['sku']
              if (sku in jsonSku) {
                box = jsonSku[sku]
                $("input[name='weight']").val(jsonBox[box][0])[0].dispatchEvent(new Event('input'))
                $("input[name='weight']")[0].dispatchEvent(new Event('change'))

                $("input[name='length']").val(jsonBox[box][1])[0].dispatchEvent(new Event('input'))
                //$("input[name='length']")[0].dispatchEvent(new Event('change'))

                $("input[name='width']").val(jsonBox[box][2])[0].dispatchEvent(new Event('input'))
                //$("input[name='width']")[0].dispatchEvent(new Event('change'))

                $("input[name='height']").val(jsonBox[box][3])[0].dispatchEvent(new Event('input'))
                $("input[name='height']").focus()
              } else {
                $("input[name='weight']").focus()
              }
            } else {
              $("input[name='weight']").focus()
            }

            sendResponse("OK")
            setTimeout(function () {
              alert("粘贴成功！")
            }, 100);
        } else if (request.action === "nodata") {
            alert("请先复制亚马逊订单！")
        }
    }
);
