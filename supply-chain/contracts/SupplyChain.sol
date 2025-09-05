// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract SupplyChain {
    enum Stage { Created, InTransit, Delivered }

    struct Product {
        uint256 id;
        string name;
        address owner;
        Stage stage;
    }

    mapping(uint256 => Product) private products;

    event ProductAdded(uint256 indexed id, string name, address indexed owner);
    event OwnershipTransferred(uint256 indexed id, address indexed previousOwner, address indexed newOwner);
    event StageUpdated(uint256 indexed id, Stage stage);

    modifier onlyOwner(uint256 _id) {
        require(products[_id].owner == msg.sender, "Not product owner");
        _;
    }

    function addProduct(uint256 _id, string calldata _name) external {
        require(products[_id].owner == address(0), "Product exists");
        products[_id] = Product({id: _id, name: _name, owner: msg.sender, stage: Stage.Created});
        emit ProductAdded(_id, _name, msg.sender);
    }

    function transferOwnership(uint256 _id, address _newOwner) external onlyOwner(_id) {
        require(_newOwner != address(0), "Invalid owner");
        address previous = products[_id].owner;
        products[_id].owner = _newOwner;
        emit OwnershipTransferred(_id, previous, _newOwner);
    }

    function updateStage(uint256 _id, Stage _stage) external onlyOwner(_id) {
        products[_id].stage = _stage;
        emit StageUpdated(_id, _stage);
    }

    function getProduct(uint256 _id) external view returns (Product memory) {
        require(products[_id].owner != address(0), "Product missing");
        return products[_id];
    }
}
