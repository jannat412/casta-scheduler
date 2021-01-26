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

        const {schedulerData, contentScrollbarHeight, slotClickedFunc, slotItemTemplateResolver, toggleExpandFunc} = this.props;
        const {renderData} = schedulerData;

        let width = schedulerData.getResourceTableWidth() - 2;
        let paddingBottom = contentScrollbarHeight;
        let displayRenderData = renderData.filter(o => o.render);
        let resourceList = displayRenderData.map((item) => {
            let indents = [];
            for(let i=0;i<item.indent;i++) {
                indents.push(<span key={`es${i}`} className="expander-space"></span>);
            }
            let indent = <span key={`es${item.indent}`} className="expander-space"></span>;
            if(item.hasChildren) {
                indent = item.expanded ? (
                    <Icon type="minus-square" key={`es${item.indent}`} style={{}} className=""
                        onClick={() => {
                            if(!!toggleExpandFunc)
                                toggleExpandFunc(schedulerData, item.slotId);
                        }}/>
                ) : (
                    <Icon type="plus-square" key={`es${item.indent}`} style={{}} className=""
                          onClick={() => {
                              if (!!toggleExpandFunc)
                                  toggleExpandFunc(schedulerData, item.slotId);
                          }}/>
                );
            }
            indents.push(indent);

            let len = item.slotName.length;
            let idx = 0;
            for (let i = 0; i < len; i++) {
                if (i >= 0 && i < len && item.slotName[i] === ' ') idx = i;
            }
            let shortName = item.slotName[0] + item.slotName[idx + 1];

            let a = slotClickedFunc != undefined ? <div className="slot-cell">{indents}
                    <div className="slot-div" onClick={() => {
                        slotClickedFunc(schedulerData, item);
                    }}>
                        <div className="slot-text-round">
                            <div className="slot-span">
                                {shortName}
                            </div>
                        </div>
                        <div className="slot-text">
                            {item.slotName}
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
                            {item.slotName}
                        </div>
                    </div>
                </div>;
            let slotItem = (
                <div title={item.slotName} className="overflow-text header2-text" style={{textAlign: "left"}}>
                    {a}
                </div>
            );
            if (!!slotItemTemplateResolver) {
                let temp = slotItemTemplateResolver(schedulerData, item, slotClickedFunc, width, "overflow-text header2-text");
                if (!!temp)
                    slotItem = temp;
            }

            let tdStyle = {height: item.rowHeight};
            if(item.groupOnly) {
                tdStyle = {
                    ...tdStyle,
                    backgroundColor: schedulerData.config.groupOnlySlotColor
                };
            }

            return (
                <tr key={item.slotId}>
                    <td data-resource-id={item.slotId} style={tdStyle}>
                        {slotItem}
                    </td>
                </tr>
            );
        });

        return (
            <div style={{paddingBottom: paddingBottom}}>
                <table className="resource-table">
                    <tbody>
                        {resourceList}
                    </tbody>
                </table>
            </div>
        )
    }
}

export default ResourceView
