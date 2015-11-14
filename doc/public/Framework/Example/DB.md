<p class="lead">
    DB 操作样例
</p>

####创建行记录并保存

    $rowData = array(
        'type' => 'pc',
        'name' => '测试一下',
        'version' => '100',
    );
    $sopProductDao = Dao_Sop_Product::insert($rowData);

####修改行记录并保存

    Dao_Sop_Product::update(array('name' => '123', 'create_time' => time(), 'update_time' => time()), 'id=:id LIMIT 1', array('id' => 1));


####查询单行记录

    
    不指定需要查出的字段，默认是 *，查出所有字段
    Dao_Wunderlist_Collection::fetchRowFromSlave('status=:status', array('status' => 0));

    指定需要查出的字段
    Dao_Wunderlist_Collection::fetchRowFromSlave('status=:status', array('status' => 0), 'id, name');

####查询多行记录

    不指定需要查出的字段，默认是 *，查出所有字段
    Dao_Wunderlist_Collection::fetchAllFromSlave('status=:status', array('status' => 0));

    指定需要查出的字段
    Dao_Wunderlist_Collection::fetchAllFromSlave('status=:status', array('status' => 0), '*');