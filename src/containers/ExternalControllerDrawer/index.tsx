import { useAtom } from 'jotai'
import { useUpdateAtom } from 'jotai/utils'
import { useEffect } from 'react'

import { Modal, Input, Alert } from '@components'
import { useObject } from '@lib/hook'
import { useI18n, useAPIInfo, identityAtom } from '@stores'
import { localStorageAtom } from '@stores/request'
import './style.scss'

export default function ExternalController() {
    const { translation } = useI18n()
    const { t } = translation('Settings')
    const { protocol, hostname, port, secret } = useAPIInfo()
    const [identity, setIdentity] = useAtom(identityAtom)
    const [value, set] = useObject({
        secret: secret,
        url: `${protocol}//${hostname}:${port}`
    })

    const setter = useUpdateAtom(localStorageAtom)

    function handleOk() {
        const { url, secret } = value
        try {
            const res = new URL(url.startsWith("http") ? url : `http://${url}`);
            setter([{ hostname: res.hostname, port: res.port, protocol: res.protocol, secret }])
        } catch {
            console.error(`url eroor: ${url}, should be like http://127.0.0.1:9090`)
        }
    }

    return (
        <Modal
            show={!identity}
            title={t('externalControllerSetting.title')}
            bodyClassName="external-controller"
            onClose={() => setIdentity(true)}
            onOk={handleOk}
        >
            <Alert type="info" inside={true}>
                <p>{t('externalControllerSetting.note')}</p>
            </Alert>
            <div className="flex items-center">
                <span className="my-1 w-14 font-bold md:my-3">{t('externalControllerSetting.url')}</span>
                <Input
                    className="my-1 flex-1 md:my-3"
                    align="left"
                    placeholder="http://127.0.0.1:9090"
                    inside={true}
                    value={value.url}
                    onChange={url => set('url', url)}
                />
            </div>
            <div className="flex items-center">
                <div className="my-1 w-14 font-bold md:my-3">{t('externalControllerSetting.secret')}</div>
                <Input
                    className="my-1 w-14 flex-1 md:my-3"
                    align="left"
                    inside={true}
                    value={value.secret}
                    onChange={secret => set('secret', secret)}
                />
            </div>
        </Modal>
    )
}
