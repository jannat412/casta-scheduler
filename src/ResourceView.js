import React, {Component} from 'react'
import {PropTypes} from 'prop-types'
import Icon from 'antd/lib/icon'

class ResourceView extends Component {

    constructor(props) {
        super(props);
    }

    static propTypes = {
        schedulerData: PropTypes.object.isRequired,
        contentScrollbarHeight: PropTypes.number.isRequired,
        slotClickedFunc: PropTypes.func,
        slotItemTemplateResolver: PropTypes.func,
        toggleExpandFunc: PropTypes.func
    }

    render() {

        const {
            schedulerData, 
            contentScrollbarHeight, 
            slotClickedFunc, 
            slotItemTemplateResolver, 
            toggleExpandFunc,
            resourceItem
        } = this.props;
        const {renderData} = schedulerData;

        let width = schedulerData.getResourceTableWidth() - 2;
        let paddingBottom = contentScrollbarHeight;
        let displayRenderData = renderData.filter(o => o.render);
        let resourceList = () => {
            let indents = [];
            for(let i=0;i<resourceItem.indent;i++) {
                indents.push(<span key={`es${i}`} className="expander-space"></span>);
            }
            let indent = <span key={`es${resourceItem.indent}`} className="expander-space"></span>;
            if(resourceItem.hasChildren) {
                indent = resourceItem.expanded ? (
                    <Icon 
                        type="minus-square" 
                        key={`es${resourceItem.indent}`} 
                        style={{}} 
                        className=""
                        onClick={() => {
                            if(!!toggleExpandFunc)
                                toggleExpandFunc(schedulerData, resourceItem.slotId);
                        }}/>
                ) : (
                    <Icon 
                        type="plus-square" 
                        key={`es${resourceItem.indent}`} 
                        style={{}} 
                        className=""
                        onClick={() => {
                            if (!!toggleExpandFunc)
                                toggleExpandFunc(schedulerData, resourceItem.slotId);
                        }}/>
                );
            }
            indents.push(indent);

            let len = resourceItem.slotName.length;
            let idx = 0;
            for (let i = 0; i < len; i++) {
                if (i >= 0 && i < len && resourceItem.slotName[i] === ' ') idx = i;
            }
            let shortName = resourceItem.slotName[0] + resourceItem.slotName[idx + 1];

            let a = slotClickedFunc != undefined ? <div className="slot-cell">{indents}
                    <div className="slot-div" onClick={() => {
                        slotClickedFunc(schedulerData, resourceItem);
                    }}>
                        <div className="slot-text-round">
                            <div className="slot-span">
                                {shortName}
                            </div>
                        </div>
                        <div className="slot-text">
                            {resourceItem.slotName}
                        </div>
                    </div>
                </div>
                : <div className="slot-cell">{indents}
                    <div className="slot-div">
                        <div className="slot-text-round">
                            <div className="slot-span">
                                {shortName}
                            </div>
                        </div>
                        <div className="slot-text">
                            {resourceItem.slotName}
                        </div>
                    </div>
                </div>;
            let slotItem = (
                <div 
                    title={resourceItem.slotName} 
                    className="overflow-text header2-text" 
                    style={{textAlign: "left"}}
                >
                    {a}
                </div>
            );
            if (!!slotItemTemplateResolver) {
                let temp = slotItemTemplateResolver(
                    schedulerData, 
                    resourceItem, 
                    slotClickedFunc, 
                    width, 
                    "overflow-text header2-text"
                );
                if (!!temp)
                    slotItem = temp;
            }

            let tdStyle = {height: resourceItem.rowHeight};
            if(resourceItem.groupOnly) {
                tdStyle = {
                    ...tdStyle,
                    backgroundColor: schedulerData.config.groupOnlySlotColor
                };
            }

            return (
                // <tr key={resourceItem.slotId}>
                //     <td data-resource-id={resourceItem.slotId} style={tdStyle}>
                //         {slotItem}
                //     </td>
                // </tr>
                <td data-resource-id={resourceItem.slotId} style={tdStyle}>
                    {slotItem}
                </td>
            );
        };

        return (
            // <div style={{ marginTop: "15px",paddingBottom: paddingBottom}}>
            //     <table className="resource-table">
            //         <tbody>
            //             {resourceList}
            //         </tbody>
            //     </table>
            // </div>
            <div style={{ marginTop: "15px",paddingBottom: paddingBottom}}>
                {resourceList}
            </div>
        )
    }
}

export default ResourceView
