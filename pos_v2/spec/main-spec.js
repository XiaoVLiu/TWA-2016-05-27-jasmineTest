describe('pos', function () {
    var allItems, inputs, dateDigitToString;

    beforeEach(function () {
        allItems = loadAllItems();
        inputs = [
            'ITEM000001',
            'ITEM000001',
            'ITEM000001',
            'ITEM000001',
            'ITEM000001',
            'ITEM000003-2',
            'ITEM000005',
            'ITEM000005',
            'ITEM000005'
        ];
        dateDigitToString = function (num) {
            return num < 10 ? '0' + num : num;
        };
    });

    it('should parse tags correctly', function() {
        var expectObject = [
            {barcode: 'ITEM000001', count: 1},
            {barcode: 'ITEM000001', count: 1},
            {barcode: 'ITEM000001', count: 1},
            {barcode: 'ITEM000001', count: 1},
            {barcode: 'ITEM000001', count: 1},
            {barcode: 'ITEM000003', count: 2},
            {barcode: 'ITEM000005', count: 1},
            {barcode: 'ITEM000005', count: 1},
            {barcode: 'ITEM000005', count: 1}
        ];

        expect(parseTags(inputs)).toEqual(expectObject);
    });

    it('should merge items correctly', function () {
        var originItems = [
            {barcode: 'ITEM000001', count: 1},
            {barcode: 'ITEM000001', count: 1},
            {barcode: 'ITEM000001', count: 1},
            {barcode: 'ITEM000001', count: 1},
            {barcode: 'ITEM000001', count: 1},
            {barcode: 'ITEM000003', count: 2},
            {barcode: 'ITEM000005', count: 1},
            {barcode: 'ITEM000005', count: 1},
            {barcode: 'ITEM000005', count: 1}
        ];

        var expectObject = [
            {barcode: 'ITEM000001', count: 5},
            {barcode: 'ITEM000003', count: 2},
            {barcode: 'ITEM000005', count: 3}
        ];

        expect(mergeItems(originItems)).toEqual(expectObject);
    });

    it('should build cartItems correctly', function () {
        var mergedItems = [
            {barcode: 'ITEM000001', count: 5},
            {barcode: 'ITEM000003', count: 2}
        ];

        var expectObject = [
            //new CartItem('ITEM000001', '雪碧', '瓶', 3.00, 5),
            {
                barcode: 'ITEM000001',
                count: 5,
                name: '雪碧',
                unit: '瓶',
                price: 3.00
            },
            {
                barcode: 'ITEM000003',
                count: 2,
                name: '荔枝',
                unit: '斤',
                price: 15.00
            }
        ];

        expect(buildOriginCartItems(mergedItems, allItems)).toEqual(expectObject);
    });

    it('should calculate free count correctly', function () {
        var mergedItems = [
            {barcode: 'ITEM000001', count: 5},
            {barcode: 'ITEM000003', count: 2}
        ];

        var expectObject = [
            {
                barcode: 'ITEM000001',
                count: 5,
                name: '雪碧',
                unit: '瓶',
                price: 3.00,
                freeCount: 1
            },
            {
                barcode: 'ITEM000003',
                count: 2,
                name: '荔枝',
                unit: '斤',
                price: 15.00,
                freeCount: 0
            }
        ];

        expect(calculateFreeCount(mergedItems, loadPromotions())).toEqual(expectObject);
    });

    it('should calculate subTotal correctly', function () {
        var items = [
            {
                barcode: 'ITEM000001',
                count: 5,
                name: '雪碧',
                unit: '瓶',
                price: 3.00,
                freeCount: 1
            },
            {
                barcode: 'ITEM000003',
                count: 2,
                name: '荔枝',
                unit: '斤',
                price: 15.00,
                freeCount: 0
            }
        ];

        var expectObject = [
            {
                barcode: 'ITEM000001',
                count: 5,
                name: '雪碧',
                unit: '瓶',
                price: 3.00,
                freeCount: 1,
                subTotal: 15.00,
                actualSubTotal: 12.00
            },
            {
                barcode: 'ITEM000003',
                count: 2,
                name: '荔枝',
                unit: '斤',
                price: 15.00,
                freeCount: 0,
                subTotal: 30.00,
                actualSubTotal: 30.00
            }
        ];

        expect(calculateSubTotal(items)).toEqual(expectObject);
    });

    it('should calculate correct total', function () {
        var items = [
            {
                barcode: 'ITEM000001',
                count: 5,
                name: '雪碧',
                unit: '瓶',
                price: 3.00,
                freeCount: 1,
                subTotal: 15.00,
                actualSubTotal: 12.00
            },
            {
                barcode: 'ITEM000003',
                count: 2,
                name: '荔枝',
                unit: '斤',
                price: 15.00,
                freeCount: 0,
                subTotal: 30.00,
                actualSubTotal: 30.00
            }
        ];

        expect(calculateTotal(items)).toBe(42.00);
    });

    it('should calculate correct saved money', function () {
        var items = [
            {
                barcode: 'ITEM000001',
                count: 5,
                name: '雪碧',
                unit: '瓶',
                price: 3.00,
                freeCount: 1,
                subTotal: 15.00,
                actualSubTotal: 12.00
            },
            {
                barcode: 'ITEM000003',
                count: 2,
                name: '荔枝',
                unit: '斤',
                price: 15.00,
                freeCount: 0,
                subTotal: 30.00,
                actualSubTotal: 30.00
            }
        ];

        expect(calculateSaveMoney(items)).toBe(3.00);
    })

    it('should print correct text', function () {

        spyOn(console, 'log');

        printInventory(inputs);

        var currentDate = new Date(),
            year = dateDigitToString(currentDate.getFullYear()),
            month = dateDigitToString(currentDate.getMonth() + 1),
            date = dateDigitToString(currentDate.getDate()),
            hour = dateDigitToString(currentDate.getHours()),
            minute = dateDigitToString(currentDate.getMinutes()),
            second = dateDigitToString(currentDate.getSeconds()),
            formattedDateString = year + '年' + month + '月' + date + '日 ' + hour + ':' + minute + ':' + second;

        var expectText =
            '***<没钱赚商店>购物清单***\n' +
            '打印时间：' + formattedDateString + '\n' +
            '----------------------\n' +
            '名称：雪碧，数量：5瓶，单价：3.00(元)，小计：12.00(元)\n' +
            '名称：荔枝，数量：2斤，单价：15.00(元)，小计：30.00(元)\n' +
            '名称：方便面，数量：3袋，单价：4.50(元)，小计：9.00(元)\n' +
            '----------------------\n' +
            '挥泪赠送商品：\n' +
            '名称：雪碧，数量：1瓶\n' +
            '名称：方便面，数量：1袋\n' +
            '----------------------\n' +
            '总计：51.00(元)\n' +
            '节省：7.50(元)\n' +
            '**********************';

        expect(console.log).toHaveBeenCalledWith(expectText);
    });
});
