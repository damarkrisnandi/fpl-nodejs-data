import { DataFrame } from "danfojs-node"

export default function dataframeBuilder(data, headerContent=null, columns=null) {
    let df = new DataFrame(data, { 
        config: {
            tableDisplayConfig: {
                header: {
                    alignment: 'center',
                    content: headerContent || 'THE HEADER\nThis is the table about something',
                },
                columns: columns || []
            },
            tableMaxRow: 50 
        }
    })
    df.print()
}